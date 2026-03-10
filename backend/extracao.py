"""
Extrai dados do prontuário a partir do texto transcrito.
"""

import re  # regex para encontrar padrões no texto


def extrair(texto_bruto: str) -> dict:
    """Analisa o texto e extrai nome do pet, idade, raça, sexo, peso, castrado, telefone, serviços, parasitas, lesões, CPF."""
    t = texto_bruto.lower()
    t_tosa = t.replace("tausa", "tosa")  # Whisper às vezes escreve "tausa"
    PALAVRAS_IGNORAR = ("que", "um", "uma", "o", "a", "de", "da", "do", "pra", "para", "com", "uma", "uns")

    # Nome do pet: "O nome da minha cadela é Kiana", "nome do meu cachorro é Rex", etc.
    pet_name = ""
    for padrao in [
        r"nome\s+(?:do\s+meu\s+|da\s+minha\s+)?(?:cachorro|gato|cão|cadela|gata|pet|animal)\s+(?:é|e)\s+([a-zà-ú]{2,30})",
        r"nome\s+(?:dele|dela)\s+(?:é|e)\s+([a-zà-ú]{2,30})",
        r"(?:chamado|chama)\s+([a-zà-ú]{2,30})",
        r"(?:é|e)\s+([a-zà-ú]{2,30})\.",  
    ]:
        m = re.search(padrao, t)
        if m:
            cand = m.group(1).strip()
            if cand not in PALAVRAS_IGNORAR:
                pet_name = cand.title()
                break

    # Espécie: cadela=cachorro=canino | gata=gato=felino (Whisper pode escrever "fellino", "félino")
    species = ""
    if re.search(r"\b(cão|cachorro|canino|cadela)\b", t):
        species = "canino"
    elif re.search(r"\b(gato|gata|felino|fellino|f[ée]lino)\b", t):
        species = "felino"

    # Idade: aceita "ele/cachorro/bicho/pet tem 3 anos (de idade)", "3 anos", "idade de 5", "tem 6 meses", etc.
    age = ""
    for padrao in [
        r"(?:ele|ela|o\s+bicho|a\s+bicha|o\s+cachorro|a\s+cadela|o\s+gato|a\s+gata|o\s+pet|o\s+animal)\s+tem\s+(\d+)\s*(?:ano|anos|meses?)(?:\s+de\s+idade)?",
        r"(?:tem\s+)?(\d+)\s*(?:ano|anos|meses?)(?:\s+de\s+idade)?\b",
        r"idade\s+(?:de\s+)?(\d+)\s*(?:ano|anos|meses?)?",
        r"(\d+)\s*(?:ano|anos|meses?)(?:\s+de\s+idade)?\b",
    ]:
        m = re.search(padrao, t)
        if m:
            age = m.group(1)
            break

    # Raça: "raça malhada", "raça dela é malhada", "raça golden" - nunca inclui "dela é"/"dele é"
    color_race = ""
    m = re.search(r"ra[çc]a\s+(?:(?:dele|dela)\s+(?:é|e)\s+)?(?:é\s+|de\s+)?([a-zà-ú\s-]{2,40}?)(?:\s+e\s+|\s*\.|,|$|\s+tem\s+|\s+pesa)", t)
    if m:
        cand = m.group(1).strip().title()
        if cand and cand not in ("De", "Tem", "O", "A"):
            color_race = cand
    if not color_race:
        m = re.search(r"(?:é\s+um?\s+|um?\s+)([a-zà-ú-]+(?:\s+[a-zà-ú-]+)?)\s+(?:retriever|pastor|poodle|pit\s*bull|bulldog|labrador|dálmata|vira-lata|srd|mestiço|mestico|persa|siamês|spitz|chihuahua|yorkshire|shih tzu)", t)
        if m:
            color_race = m.group(1).strip().title()
    if not color_race:
        racas = [
            "golden retriever", "golden", "labrador", "pastor alemão", "pastor",
            "poodle", "pit bull", "bulldog", "bulldog francês", "dálmata",
            "vira-lata", "srd", "mestiço", "mestico", "persa", "siamês", "siames",
            "shih tzu", "yorkshire", "chihuahua", "spitz", "beagle", "rottweiler",
            "lhasa apso", "doberman", "husky", "border collie", "akita",
        ]
        for raca in racas:
            if re.search(rf"\b{re.escape(raca)}\b", t):
                color_race = raca.title()
                break

    # Sexo: cadela/gata=fêmea | cachorro/gato (macho por contexto) | ele/dele=macho | ela/dela=fêmea
    sex = ""
    if re.search(r"\bmacho\b", t):
        sex = "macho"
    elif re.search(r"\b(?:f[êe]mea|femea)\b", t) or re.search(r"\bcadela\b", t) or re.search(r"\bgata\b", t):
        sex = "femea"
    elif re.search(r"\b(?:ele|dele)\b", t):
        sex = "macho"
    elif re.search(r"\b(?:ela|dela)\b", t):
        sex = "femea"

    # Castrado: "ele é castrado", "não é castrado", "já castrado", "castração", etc.
    neutered = None
    if re.search(r"\bn[ãa]o\s+(?:é\s+)?(?:castrado|castrada|castr)", t):
        neutered = False
    elif re.search(
        r"\b(?:ele|ela|o\s+bicho|a\s+cadela|o\s+cachorro|a\s+gata|o\s+gato|o\s+pet)\s+(?:é|e)\s+castrad[oa]",
        t,
    ) or re.search(r"\b(?:castrado|castrada|j[áa]?\s+castr|castra[çc][ãa]o)\b", t):
        neutered = True

    # Peso: "pesa 8 kg", "8 kg", "8 quilos", "8kg" - retorna sempre "numero kg"
    weight_raw = ""
    m = re.search(r"pesa\s*(\d+(?:[.,]\d+)?)\s*(?:kg|quilos?)?", t)
    if m:
        weight_raw = m.group(1).replace(",", ".")
    if not weight_raw:
        m = re.search(r"(\d+(?:[.,]\d+)?)\s*(?:kg|quilos?)\b", t)
        if m:
            weight_raw = m.group(1).replace(",", ".")
    weight = f"{weight_raw} kg" if weight_raw else ""

    # CPF (últimos 11 dígitos do texto)
    nums = re.sub(r"\D", "", texto_bruto)
    tutor_cpf = f"{nums[-11:-8]}.{nums[-8:-5]}.{nums[-5:-2]}-{nums[-2:]}" if len(nums) >= 11 else ""

    # Nome do tutor: "meu nome é João", "tutor João", "dono é Maria Silva"
    tutor_name = ""
    for padrao in [
        r"meu\s+nome\s+(?:é|e)\s+([a-zà-ú\s]{2,50})",
        r"(?:tutor|dono)\s+(?:é|e\s+)?([a-zà-ú\s]{2,50})",
    ]:
        m = re.search(padrao, t)
        if m:
            cand = m.group(1).strip().title()
            if cand and cand not in ("De", "Da", "Do", "E", "O", "A"):
                tutor_name = cand
                break

    # Telefone: (11) 99999-9999, 11 999999999, 11999999999 - adiciona 9 se tiver 10 dígitos (padrão celular BR)
    tutor_phone = ""
    m = re.search(r"(?:telefone|celular|whatsapp|tel\.?|fone|whats)\s*[:\s]*\(?(\d{2})\)?\s*[\s.-]*(\d{4,5})[\s.-]*(\d{4})", t)
    if m:
        ddd, p1, p2 = m.group(1), m.group(2), m.group(3)
        digits = ddd + p1 + p2
        if len(digits) == 10 and digits[2] != "9":
            digits = digits[:2] + "9" + digits[2:]  # adiciona 9 (padrão celular)
        if len(digits) >= 10:
            tutor_phone = f"({digits[:2]}) {digits[2:-4]}-{digits[-4:]}"
    if not tutor_phone:
        m = re.search(r"\(?\d{2}\)?\s*[\s.-]*\d{4,5}[\s.-]*\d{4}", texto_bruto)
        if m:
            digits = re.sub(r"\D", "", m.group(0))
            if len(digits) == 10 and digits[2] != "9":
                digits = digits[:2] + "9" + digits[2:]
            if len(digits) >= 10:
                tutor_phone = f"({digits[:2]}) {digits[2:-4]}-{digits[-4:]}"

    # Banho
    bath = {
        "padrao": bool(re.search(r"banho\s+padr[ãa]o", t)),
        "hidratacao": bool(re.search(r"hidrata[çc][ãa]o", t)),
        "selagem": bool(re.search(r"selagem", t)),
    }

    # Tosa
    grooming = {
        "tesoura": bool(re.search(r"tesoura", t_tosa)),
        "maquina": bool(re.search(r"m[áa]quina", t_tosa)),
        "higienica": bool(re.search(r"higi[eê]nica", t_tosa)),
        "tosaBebe": bool(re.search(r"tosa\s+beb[eê]", t_tosa)),
        "tosaDaRaca": bool(re.search(r"tosa\s+da\s+ra[çc]a", t_tosa)),
        "desembolo": bool(re.search(r"desembolo", t_tosa)),
    }

    # Itens: coleira, peitoral, enforcador, focinheira, guia
    tem_coleira = bool(re.search(r"\bcoleira\b", t))
    nao_coleira = bool(re.search(r"n[ãa]o\s+(?:tem|trouxe|veio)\s+(?:com\s+)?coleira", t))
    tem_peitoral = bool(re.search(r"\bpeitoral\b", t))
    nao_peitoral = bool(re.search(r"n[ãa]o\s+(?:tem|trouxe|veio)\s+(?:com\s+)?peitoral", t))
    tem_enforcador = bool(re.search(r"\benforcador\b", t))
    nao_enforcador = bool(re.search(r"n[ãa]o\s+(?:tem|trouxe|veio)\s+(?:com\s+)?enforcador", t))
    tem_focinheira = bool(re.search(r"\bfocinheira\b", t))
    nao_focinheira = bool(re.search(r"n[ãa]o\s+(?:tem|trouxe|veio)\s+(?:com\s+)?focinheira", t))
    tem_guia = bool(re.search(r"\bguia\b", t))
    nao_guia = bool(re.search(r"n[ãa]o\s+(?:tem|trouxe|veio)\s+(?:com\s+)?guia", t))
    items = {
        "coleira": tem_coleira and not nao_coleira,
        "peitoral": tem_peitoral and not nao_peitoral,
        "enforcador": tem_enforcador and not nao_enforcador,
        "focinheira": tem_focinheira and not nao_focinheira,
        "guia": tem_guia and not nao_guia,
    }

    # Parasitas
    parasites = {
        "pulgas": bool(re.search(r"pulga", t)),
        "carrapatos": bool(re.search(r"carrapato", t)),
    }

    # Lesões ("tem secreção no ouvido" = True; "não tem secreção" = precisa checar)
    tem_secrecao = bool(re.search(r"secre[çc][ãa]o", t))
    tem_ouvido = bool(re.search(r"ouvido", t))
    nao_tem = bool(re.search(r"n[ãa]o\s+tem\s+(?:uma\s+)?secre", t))
    lesions = {
        "pele": bool(re.search(r"pele|les[ãa]o", t)),
        "olhos": bool(re.search(r"olho", t)),
        "secrecao": tem_secrecao and not nao_tem,
        "ouvido": tem_ouvido and not nao_tem,
    }

    out = {
        "petName": pet_name,
        "species": species,
        "age": age,
        "colorRace": color_race,
        "sex": sex,
        "weight": weight,
        "tutorName": tutor_name,
        "tutorPhone": tutor_phone,
        "tutorCPF": tutor_cpf,
        "items": items,
        "bathServices": bath,
        "groomingServices": grooming,
        "parasites": parasites,
        "lesions": lesions,
        "transcription": texto_bruto.strip(),
        "analysisNotes": "",
    }
    if neutered is not None:
        out["neutered"] = neutered
    return out
