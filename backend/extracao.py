"""
Extrai dados do prontuário veterinário a partir do texto transcrito.
Versão profissional com sinais vitais, clínicos e sistema de diagnóstico.
"""

import re


def extrair(texto_bruto: str) -> dict:
    """Analisa o texto e extrai dados clínicos completos do prontuário."""
    t = texto_bruto.lower()
    
    PALAVRAS_IGNORAR = ("que", "um", "uma", "o", "a", "de", "da", "do", "pra", "para", "com")

    # ========== DADOS BÁSICOS DO ANIMAL ==========
    
    # Nome do pet
    pet_name = ""
    for padrao in [
        r"nome\s+(?:do\s+meu\s+|da\s+minha\s+)?(?:cachorro|gato|cão|cadela|gata|pet|animal)\s+(?:é|e)\s+([a-zà-ú]{2,30})",
        r"nome\s+(?:dele|dela)\s+(?:é|e)\s+([a-zà-ú]{2,30})",
        r"(?:chamado|chama)\s+([a-zà-ú]{2,30})",
    ]:
        m = re.search(padrao, t)
        if m:
            cand = m.group(1).strip()
            if cand not in PALAVRAS_IGNORAR:
                pet_name = cand.title()
                break

    # Espécie
    species = ""
    if re.search(r"\b(cão|cachorro|canino|cadela)\b", t):
        species = "canino"
    elif re.search(r"\b(gato|gata|felino)\b", t):
        species = "felino"
    elif re.search(r"\b(pássaro|passarinho|ave|periquito|calopsita)\b", t):
        species = "ave"
    elif re.search(r"\b(hamster|porquinho da Índia|cobaia|roedor|coelho)\b", t):
        species = "roedor"

    # Raça
    breed = ""
    racas = [
        "golden retriever", "golden", "labrador", "pastor alemão", "poodle", 
        "pit bull", "bulldog", "bulldog francês", "dálmata", "vira-lata", 
        "mestiço", "persa", "siamês", "shih tzu", "yorkshire", "chihuahua", 
        "spitz", "beagle", "rottweiler", "lhasa apso", "doberman", "husky",
        "schnauzer", "dachshund", "bassê", "cocker spaniel", "maltês",
    ]
    for raca in racas:
        if raca in t:
            breed = raca.title()
            break
    
    if not breed:
        m = re.search(r"ra[çc]a\s+(?:dele|dela)?\s*(?:é|de)?\s*([a-zà-ú\s-]{2,40})", t)
        if m:
            cand = m.group(1).strip().title()
            if cand and cand not in ("De", "Tem", "O", "A"):
                breed = cand

    # Cor/Pelagem
    color = ""
    for padrao in [r"cor\s+(?:é|de|del[ae])\s+([a-zà-ú\s-]{2,30})", r"pelagem\s+(?:é|de)\s+([a-zà-ú\s-]{2,30})"]:
        m = re.search(padrao, t)
        if m:
            color = m.group(1).strip().title()
            break

    # Idade
    age = ""
    for padrao in [
        r"(?:ele|ela|o\s+cachorro|a\s+cadela|o\s+gato|a\s+gata)\s+tem\s+(\d+)\s*(?:ano|anos|meses?)",
        r"(\d+)\s*(?:ano|anos|meses?)\s+de\s+idade",
    ]:
        m = re.search(padrao, t)
        if m:
            age = m.group(1)
            break

    # Sexo
    sex = ""
    if re.search(r"\bmacho\b", t):
        sex = "macho"
    elif re.search(r"\b(?:f[êe]mea|femea)\b", t) or re.search(r"\bcadela\b|\bgata\b", t):
        sex = "femea"

    # Castrado
    neutered = None
    if re.search(r"\bn[ãa]o\s+(?:é\s+)?castrad", t):
        neutered = False
    elif re.search(r"\b(?:castrado|castrada|j[áa]?\s+castr)\b", t):
        neutered = True

    # Peso
    weight = ""
    m = re.search(r"pesa\s*(\d+(?:[.,]\d+)?)\s*(?:kg|quilos?)?", t)
    if m:
        weight = m.group(1).replace(",", ".")
    if not weight:
        m = re.search(r"(\d+(?:[.,]\d+)?)\s*(?:kg|quilos?)\b", t)
        if m:
            weight = m.group(1).replace(",", ".")

    # Microchip
    microchip = ""
    m = re.search(r"microchip\s*(?:número|numero)?\s*[:\s]*(\d+)", t)
    if m:
        microchip = m.group(1)

    # ========== DADOS DO TUTOR ==========
    
    # CPF
    nums = re.sub(r"\D", "", texto_bruto)
    tutor_cpf = f"{nums[-11:-8]}.{nums[-8:-5]}.{nums[-5:-2]}-{nums[-2:]}" if len(nums) >= 11 else ""

    # Nome do tutor
    tutor_name = ""
    for padrao in [r"meu\s+nome\s+(?:é|e)\s+([a-zà-ú\s]{2,50})", r"(?:tutor|dono)\s+(?:é|e)\s+([a-zà-ú\s]{2,50})"]:
        m = re.search(padrao, t)
        if m:
            cand = m.group(1).strip().title()
            if cand and cand not in ("De", "Da", "Do", "E", "O", "A"):
                tutor_name = cand
                break

    # Telefone
    tutor_phone = ""
    m = re.search(r"(?:telefone|celular|whatsapp)\s*[:\s]*\(?(\d{2})\)?\s*[\s.-]*(\d{4,5})[\s.-]*(\d{4})", t)
    if m:
        ddd, p1, p2 = m.group(1), m.group(2), m.group(3)
        digits = ddd + p1 + p2
        if len(digits) == 10 and digits[2] != "9":
            digits = digits[:2] + "9" + digits[2:]
        if len(digits) >= 10:
            tutor_phone = f"({digits[:2]}) {digits[2:-4]}-{digits[-4:]}"

    # ========== SINAIS VITAIS ==========
    
    # Temperatura
    temperature = ""
    m = re.search(r"temperatura\s*(?:de\s+)?(\d+[.,]\d+)\s*(?:graus|°c|c)?", t)
    if m:
        temperature = m.group(1).replace(",", ".")
    if not temperature:
        m = re.search(r"(\d+[.,]\d+)\s*°?c", t)
        if m:
            temperature = m.group(1).replace(",", ".")

    # Frequência cardíaca
    heart_rate = ""
    for padrao in [r"fc\s*:?\s*(\d+)", r"frequ[êe]cia\s+card[ií]aca\s*:?\s*(\d+)", r"bpm\s*:?\s*(\d+)"]:
        m = re.search(padrao, t)
        if m:
            heart_rate = m.group(1)
            break

    # Frequência respiratória
    respiratory_rate = ""
    for padrao in [r"fr\s*:?\s*(\d+)", r"frequ[êe]cia\s+respirat[óo]ria\s*:?\s*(\d+)", r"rpm\s*:?\s*(\d+)"]:
        m = re.search(padrao, t)
        if m:
            respiratory_rate = m.group(1)
            break

    # TRC
    trc = ""
    m = re.search(r"trc\s*:?\s*(\d+)\s*(?:segundos|seg)?", t)
    if m:
        trc = m.group(1)

    # Mucosas
    mucous_membrane = ""
    if re.search(r"rosad[oa]|cor-de-rosa", t):
        mucous_membrane = "rosadas"
    elif re.search(r"pálid[oa]|palido", t):
        mucous_membrane = "pálidas"
    elif re.search(r"ictéric[oa]|amarelad[oa]", t):
        mucous_membrane = "ictéricas"
    elif re.search(r"cianótic[oa]|azulad[oa]", t):
        mucous_membrane = "cianóticas"

    # Hidratação
    hydration = "normal"
    if re.search(r"desidratad[oa]\s+sever[oa]", t):
        hydration = "severo"
    elif re.search(r"desidratad[oa]\s+moderad[oa]", t):
        hydration = "moderado"
    elif re.search(r"desidratad[oa]\s+lev[ea]", t):
        hydration = "desidratado leve"

    # Condição corporal
    body_condition = "normal"
    if re.search(r"obes[oa]|gord[oa]|acima\s+do\s+peso", t):
        body_condition = "obesidade"
    elif re.search(r"magro|magrr|abaixo\s+do\s+peso", t):
        body_condition = "magro"

    # ========== SINAIS CLÍNICOS ==========
    
    # Vômito
    vomiting = bool(re.search(r"vomit|vômito", t))
    vomiting_frequency = ""
    if vomiting:
        m = re.search(r"vomitou\s+(\d+)\s*(?:vez|vezes)?", t)
        if m:
            vomiting_frequency = f"{m.group(1)}x"

    # Diarreia
    diarrhea = bool(re.search(r"diarreia|fezes\s+(?:líquidas|brandas|moles)", t))
    diarrhea_frequency = ""
    if diarrhea:
        m = re.search(r"diarreia\s+(\d+)\s*(?:vez|vezes)?", t)
        if m:
            diarrhea_frequency = f"{m.group(1)}x"

    # Tosse
    coughing = bool(re.search(r"toss", t))
    coughing_type = ""
    if coughing:
        if re.search(r"tosse\s+seca", t):
            coughing_type = "seca"
        elif re.search(r"tosse\s+produtiva", t):
            coughing_type = "produtiva"

    # Letargia
    lethargy = bool(re.search(r"letarg|létarg|fraco|prostrad|desanimad|cansad|abatido", t))

    # Anorexia
    anorexia = bool(re.search(r"anorexia|inapetênc|sem\s+apetite|não\s+come|pouco\s+apetite", t))

    # Poliúria/Polidipsia
    polyuria = bool(re.search(r"poliúria|muita\s+urine|muit[oa]\s+xixi", t))
    polydipsia = bool(re.search(r"polidipsia|mucha\s+sede|bebendo\s+muito", t))

    # Dispneia
    dyspnea = bool(re.search(r"dispneia|dificuldade\s+respirar|falta\s+de\s+ar|ofegante", t))

    # Descarga nasal
    nasal_discharge = bool(re.search(r"descarga\s+nasal|secreção\s+nasal|corrimento\s+nariz|ranho", t))

    # Descarga ocular
    ocular_discharge = bool(re.search(r"descarga\s+ocular|secreção\s+ocular|corrimento\s+olho|lacrimej|conjuntivite", t))

    # Prurido
    pruritus = bool(re.search(r"prurido|coceira|coçando|coçar", t))

    # Dor
    pain = bool(re.search(r"dor|queixoso|gemendo|manco|claudicação|manqueira", t))
    pain_level = ""
    if pain:
        m = re.search(r"nível?\s+de\s+dor\s+(\d+)", t)
        if m:
            pain_level = m.group(1)

    # Perda de peso
    weight_loss = bool(re.search(r"perda\s+de\s+peso|emagre[çc]|magrec|perdeu\s+peso", t))

    # Fraqueza
    weakness = bool(re.search(r"fraqueza|fraco|debilitad|tontura|mareio", t))

    # Colapso
    collapse = bool(re.search(r"colaps|desmai|perdeu\s+a\s+consciência", t))

    # Convulsões
    seizures = bool(re.search(r"convuls|ataque\s+epilétic|epilepsia", t))

    # ========== EXAME FÍSICO ==========
    
    general_state = "alerta"
    if re.search(r"estado\s+geral\s+(?:bom|regular|ruim|estável)", t):
        m = re.search(r"estado\s+geral\s+(\w+)", t)
        if m:
            general_state = m.group(1)
    elif re.search(r"deprimid|abatido|prostrad", t):
        general_state = "deprimido"
    elif re.search(r"letarg|létarg", t):
        general_state = "letárgico"

    # ========== HISTÓRICO MÉDICO ==========
    
    current_medications = ""
    m = re.search(r"(?:medicamento|remédio)\s+(?:atual|que\s+toma)\s+(?:é|são)\s+(.+?)(?:\.|$)", t)
    if m:
        current_medications = m.group(1).strip()

    previous_illnesses = ""
    m = re.search(r"(?:doença|patologia)\s+(?:anterior|preexistente)\s+(?:é|foi)\s+(.+?)(?:\.|$)", t)
    if m:
        previous_illnesses = m.group(1).strip()

    allergies = ""
    m = re.search(r"alergia\s+(?:a|de)\s+(.+?)(?:\.|$|,)", t)
    if m:
        allergies = m.group(1).strip()

    diet = ""
    m = re.search(r"dieta\s+(?:atual|de)\s+(.+?)(?:\.|$|,)", t)
    if m:
        diet = m.group(1).strip()

    # ========== QUEIXA PRINCIPAL ==========
    
    chief_complaint = ""
    for padrao in [
        r"motivo\s+da\s+consulta\s+(?:é|e|:\s*)\s+(.+?)(?:\.|$)",
        r"queixa\s+principal\s+(?:é|e|:\s*)\s+(.+?)(?:\.|$)",
        r"veio\s+(?:porque|por|com)\s+(.+?)(?:\.|$)",
    ]:
        m = re.search(padrao, t)
        if m:
            chief_complaint = m.group(1).strip().capitalize()
            break

    # ========== OBSERVAÇÕES CLÍNICAS ==========
    
    observations = []
    
    if vomiting:
        m = re.search(r"vomit(?:ou|os?)\s+[\w\s]+?(?:\.|$|,)", t)
        if m:
            observations.append(f"Vômito: {m.group(0)}")
    
    if diarrhea:
        m = re.search(r"diarreia\s+[\w\s]+?(?:\.|$|,)", t)
        if m:
            observations.append(f"Diarreia: {m.group(0)}")
    
    if re.search(r"febre|pirexia", t):
        observations.append("Febre relatada")
    
    if re.search(r"sangramento|sangue|hemorragia", t):
        observations.append("Sangramento/presença de sangue")
    
    if re.search(r"convulsão|tremor|paralisia", t):
        observations.append("Sinais neurológicos")
    
    clinical_observations = ". ".join(observations) if observations else ""

    # ========== RESULTADO ==========
    
    out = {
        "petName": pet_name,
        "species": species,
        "breed": breed,
        "color": color,
        "age": age,
        "sex": sex,
        "neutered": neutered,
        "weight": weight,
        "microchip": microchip,
        "tutorName": tutor_name,
        "tutorPhone": tutor_phone,
        "tutorCPF": tutor_cpf,
        "temperature": temperature,
        "heartRate": heart_rate,
        "respiratoryRate": respiratory_rate,
        "capillaryRefillTime": trc,
        "mucousMembrane": mucous_membrane,
        "hydration": hydration,
        "bodyCondition": body_condition,
        "pulse": "",
        "vomiting": vomiting,
        "vomitingFrequency": vomiting_frequency,
        "diarrhea": diarrhea,
        "diarrheaFrequency": diarrhea_frequency,
        "coughing": coughing,
        "coughingType": coughing_type,
        "lethargy": lethargy,
        "anorexia": anorexia,
        "polyuria": polyuria,
        "polydipsia": polydipsia,
        "dyspnea": dyspnea,
        "nasalDischarge": nasal_discharge,
        "ocularDischarge": ocular_discharge,
        "pruritus": pruritus,
        "pain": pain,
        "painLevel": pain_level,
        "weightLoss": weight_loss,
        "weakness": weakness,
        "collapse": collapse,
        "seizures": seizures,
        "generalState": general_state,
        "abdominalPalpation": "",
        "currentMedications": current_medications,
        "previousIllnesses": previous_illnesses,
        "allergies": allergies,
        "diet": diet,
        "chiefComplaint": chief_complaint,
        "anamnesis": "",
        "clinicalObservations": clinical_observations,
        "transcription": texto_bruto.strip(),
        "analysisNotes": "",
    }
    
    return out


def get_diagnostic_suggestions(clinical_signs: dict, species: str = "canino", breed: str = "") -> list:
    """
    Retorna sugestões de diagnóstico baseadas nos sinais clínicos.
    Implementa lógica similar à Cornell University Consultant.
    """
    
    symptom_pathologies = {
        "vomito": [
            {"pathology": "Gastrite", "probability": "alta", "breeds": ["Todas"]},
            {"pathology": "Enterite", "probability": "alta", "breeds": ["Todas"]},
            {"pathology": "Pancreatite", "probability": "media", "breeds": ["Yorkshire", "Poodle", "Schnauzer"]},
            {"pathology": "Obstrução intestinal", "probability": "alta", "breeds": ["Todas"]},
            {"pathology": "Insuficiência renal crônica", "probability": "media", "breeds": ["Idosos"]},
        ],
        "diarreia": [
            {"pathology": "Enterite", "probability": "alta", "breeds": ["Todas"]},
            {"pathology": "Gastrite", "probability": "alta", "breeds": ["Todas"]},
            {"pathology": "Parvovirose", "probability": "alta", "breeds": ["Cães jovens não vacinados"]},
            {"pathology": "Giardíase", "probability": "media", "breeds": ["Todas"]},
            {"pathology": "Colite", "probability": "media", "breeds": ["Todas"]},
        ],
        "tosse": [
            {"pathology": "Traqueobronquite infecciosa", "probability": "alta", "breeds": ["Todas"]},
            {"pathology": "Bronquite alérgica", "probability": "media", "breeds": ["Todas"]},
            {"pathology": "Pneumonia", "probability": "media", "breeds": ["Todas"]},
            {"pathology": "Cardiomiopatia", "probability": "media", "breeds": ["Doberman", "Boxer", "Golden Retriever"]},
            {"pathology": "Colapso de traqueia", "probability": "alta", "breeds": ["Yorkshire", "Poodle", "Chihuahua"]},
        ],
        "letargia": [
            {"pathology": "Anemia", "probability": "alta", "breeds": ["Todas"]},
            {"pathology": "Doença sistêmica", "probability": "alta", "breeds": ["Todas"]},
            {"pathology": "Hipotireoidismo", "probability": "media", "breeds": ["Golden Retriever", "Labrador"]},
        ],
        "anorexia": [
            {"pathology": "Doença periodontal", "probability": "alta", "breeds": ["Todas"]},
            {"pathology": "Gastrite", "probability": "alta", "breeds": ["Todas"]},
            {"pathology": "Pancreatite", "probability": "media", "breeds": ["Yorkshire", "Poodle"]},
        ],
        "dispneia": [
            {"pathology": "Asma felina", "probability": "alta", "breeds": ["Gatos"]},
            {"pathology": "Doença cardíaca", "probability": "alta", "breeds": ["Todas"]},
            {"pathology": "Pneumonia", "probability": "media", "breeds": ["Todas"]},
        ],
        "prurido": [
            {"pathology": "Dermatite alérgica", "probability": "alta", "breeds": ["Todas"]},
            {"pathology": "Sarna", "probability": "alta", "breeds": ["Todas"]},
            {"pathology": "Dermatite atópica", "probability": "alta", "breeds": ["Golden", "Labrador", "Bulldog"]},
            {"pathology": "Alergia alimentar", "probability": "media", "breeds": ["Todas"]},
        ],
        "poliuria": [
            {"pathology": "Diabetes mellitus", "probability": "alta", "breeds": ["Todas"]},
            {"pathology": "Insuficiência renal crônica", "probability": "alta", "breeds": ["Idosos"]},
            {"pathology": "Hipertireoidismo", "probability": "alta", "breeds": ["Gatos idosos"]},
            {"pathology": "Síndrome de Cushing", "probability": "media", "breeds": ["Poodle", "Dachshund"]},
        ],
        "convulsoes": [
            {"pathology": "Epilepsia idiopática", "probability": "alta", "breeds": ["Golden", "Labrador", "Beagle"]},
            {"pathology": "Intoxicação", "probability": "media", "breeds": ["Todas"]},
            {"pathology": "Hipoglicemia", "probability": "media", "breeds": ["Cães miniaturas"]},
        ],
    }
    
    suggestions = []
    breed_lower = breed.lower() if breed else ""
    
    sign_mapping = {
        "vomiting": "vomito",
        "diarrhea": "diarreia",
        "coughing": "tosse",
        "lethargy": "letargia",
        "anorexia": "anorexia",
        "dyspnea": "dispneia",
        "pruritus": "prurido",
        "polyuria": "poliuria",
        "seizures": "convulsoes",
    }
    
    for sign_key, sign_value in clinical_signs.items():
        if sign_value and sign_key in sign_mapping:
            pathology_key = sign_mapping[sign_key]
            if pathology_key in symptom_pathologies:
                for pat in symptom_pathologies[pathology_key]:
                    races = pat["breeds"]
                    breed_match = False
                    if "Todas" in races:
                        breed_match = True
                    elif "Gatos" in races and species == "felino":
                        breed_match = True
                    elif "Idosos" in races:
                        breed_match = True
                    else:
                        for r in races:
                            if r.lower() in breed_lower or breed_lower in r.lower():
                                breed_match = True
                                break
                    
                    if breed_match:
                        suggestions.append({
                            "condition": pat["pathology"],
                            "probability": pat["probability"],
                            "sign": sign_key,
                        })
    
    # Remove duplicatas
    seen = set()
    unique_suggestions = []
    for s in suggestions:
        if s["condition"] not in seen:
            seen.add(s["condition"])
            unique_suggestions.append(s)
    
    # Ordena
    priority = {"alta": 0, "media": 1, "baixa": 2}
    unique_suggestions.sort(key=lambda x: priority.get(x["probability"], 3))
    
    return unique_suggestions[:10]

