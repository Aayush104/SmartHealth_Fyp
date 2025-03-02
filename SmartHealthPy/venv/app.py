
import pandas as pd
import numpy as np
from nltk.corpus import wordnet
import csv
import json
import itertools
from spacy.lang.en.stop_words import STOP_WORDS
import spacy
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from React frontend

# Load spaCy model
nlp = spacy.load('en_core_web_sm')

# Initialize data storage
data = {"users": []}
with open('DATA.json', 'w') as outfile:
    json.dump(data, outfile)

def write_json(new_data, filename='DATA.json'):
    with open(filename, 'r+') as file:
        file_data = json.load(file)
        file_data["users"].append(new_data)
        file.seek(0)
        json.dump(file_data, file, indent=4)

# Load datasets
df_tr = pd.read_csv('Medical_dataset/Training.csv')
df_tt = pd.read_csv('Medical_dataset/Testing.csv')

# Extract symptoms and diseases
symp = []
disease = []
for i in range(len(df_tr)):
    symp.append(df_tr.columns[df_tr.iloc[i] == 1].to_list())
    disease.append(df_tr.iloc[i, -1])

# Get all symptoms
all_symp_col = list(df_tr.columns[:-1])

def clean_symp(sym):
    return sym.replace('_', ' ').replace('.1', '').replace('(typhos)', '').replace('yellowish', 'yellow').replace(
        'yellowing', 'yellow')

all_symp = [clean_symp(sym) for sym in (all_symp_col)]

def preprocess(doc):
    nlp_doc = nlp(doc)
    d = []
    for token in nlp_doc:
        if (not token.text.lower() in STOP_WORDS and token.text.isalpha()):
            d.append(token.lemma_.lower())
    return ' '.join(d)

all_symp_pr = [preprocess(sym) for sym in all_symp]

# Associate each processed symptom with column name
col_dict = dict(zip(all_symp_pr, all_symp_col))

# Powerset function - returns all subsets of a set
def powerset(seq):
    if len(seq) <= 1:
        yield seq
        yield []
    else:
        for item in powerset(seq[1:]):
            yield [seq[0]] + item
            yield item

# Sort list based on length
def sort(a):
    for i in range(len(a)):
        for j in range(i + 1, len(a)):
            if len(a[j]) > len(a[i]):
                a[i], a[j] = a[j], a[i]
    if a:  # Check if list is not empty
        a.pop()
    return a

# Find all permutations of a list
def permutations(s):
    perms = list(itertools.permutations(s))
    return ([' '.join(permutation) for permutation in perms])

# Check if text exists in processed symptoms list
def DoesExist(txt):
    txt = txt.split(' ')
    combinations = [x for x in powerset(txt)]
    if combinations:  # Check if list is not empty
        sort(combinations)
    for comb in combinations:
        for sym in permutations(comb):
            if sym in all_symp_pr:
                return sym
    return False

# Jaccard similarity between two documents
def jaccard_set(str1, str2):
    list1 = str1.split(' ')
    list2 = str2.split(' ')
    intersection = len(list(set(list1).intersection(list2)))
    union = (len(list1) + len(list2)) - intersection
    return float(intersection) / union if union > 0 else 0

# Syntactic similarity
def syntactic_similarity(symp_t, corpus):
    most_sim = []
    poss_sym = []
    for symp in corpus:
        d = jaccard_set(symp_t, symp)
        most_sim.append(d)
    
    if most_sim:  # Check if list is not empty
        order = np.argsort(most_sim)[::-1].tolist()
        for i in order:
            existing = DoesExist(symp_t)
            if existing:
                return 1, [corpus[i]]
            if corpus[i] not in poss_sym and most_sim[i] != 0:
                poss_sym.append(corpus[i])
    
    if len(poss_sym):
        return 1, poss_sym
    else:
        return 0, None

# Check pattern
def check_pattern(inp, dis_list):
    import re
    pred_list = []
    ptr = 0
    patt = "^" + inp + "$"
    regexp = re.compile(inp)
    for item in dis_list:
        if regexp.search(item):
            pred_list.append(item)
    if (len(pred_list) > 0):
        return 1, pred_list
    else:
        return ptr, None

# Word Sense Disambiguation
from nltk.wsd import lesk
from nltk.tokenize import word_tokenize

def WSD(word, context):
    sens = lesk(context, word)
    return sens

# Semantic similarity between two documents
def semanticD(doc1, doc2):
    doc1_p = preprocess(doc1).split(' ')
    doc2_p = preprocess(doc2).split(' ')
    score = 0
    for tock1 in doc1_p:
        for tock2 in doc2_p:
            syn1 = WSD(tock1, doc1)
            syn2 = WSD(tock2, doc2)
            if syn1 is not None and syn2 is not None:
                x = syn1.wup_similarity(syn2)
                if x is not None and x > 0.25:
                    score += x
    denominator = len(doc1_p) * len(doc2_p)
    return score / denominator if denominator > 0 else 0

# Apply semantic similarity
def semantic_similarity(symp_t, corpus):
    max_sim = 0
    most_sim = None
    for symp in corpus:
        d = semanticD(symp_t, symp)
        if d > max_sim:
            most_sim = symp
            max_sim = d
    return max_sim, most_sim

# Suggest synonyms
def suggest_syn(sym):
    symp = []
    synonyms = wordnet.synsets(sym)
    lemmas = [word.lemma_names() for word in synonyms]
    lemmas = list(set(itertools.chain(*lemmas)))
    for e in lemmas:
        res, sym1 = semantic_similarity(e, all_symp_pr)
        if res != 0:
            symp.append(sym1)
    return list(set(symp))

# One-Hot-Vector dataframe
def OHV(cl_sym, all_sym):
    l = np.zeros([1, len(all_sym)])
    for sym in cl_sym:
        if sym in all_sym:
            l[0, all_sym.index(sym)] = 1
    return pd.DataFrame(l, columns=all_symp)

def contains(small, big):
    a = True
    for i in small:
        if i not in big:
            a = False
    return a

# List of symptoms --> possible diseases
def possible_diseases(l):
    poss_dis = []
    for dis in set(disease):
        if contains(l, symVONdisease(df_tr, dis)):
            poss_dis.append(dis)
    return poss_dis

# Disease --> all symptoms
def symVONdisease(df, disease):
    ddf = df[df.prognosis == disease]
    m2 = (ddf == 1).any()
    return m2.index[m2].tolist()

# Load KNN model
knn_clf = joblib.load('model/knn.pkl')

# Dictionaries for severity, description, and precaution
severityDictionary = dict()
description_list = dict()
precautionDictionary = dict()

def getDescription():
    global description_list
    with open('Medical_dataset/symptom_Description.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            _description = {row[0]: row[1]}
            description_list.update(_description)

def getSeverityDict():
    global severityDictionary
    with open('Medical_dataset/symptom_severity.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            try:
                _diction = {row[0]: int(row[1])}
                severityDictionary.update(_diction)
            except:
                pass

def getprecautionDict():
    global precautionDictionary
    with open('Medical_dataset/symptom_precaution.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            _prec = {row[0]: [row[1], row[2], row[3], row[4]]}
            precautionDictionary.update(_prec)

# Load dictionaries
getSeverityDict()
getprecautionDict()
getDescription()

# Calculate patient condition
def calc_condition(exp, days):
    sum = 0
    for item in exp:
        if item in severityDictionary.keys():
            sum = sum + severityDictionary[item]
    if len(exp) > 0:
        if ((sum * days) / (len(exp)) > 13):
            return 1
        else:
            return 0
    return 0

# Get related symptoms
def related_sym(psym1):
    symptoms = []
    for num, it in enumerate(psym1):
        symptoms.append({"id": num, "symptom": clean_symp(it)})
    return symptoms

# API session state
sessions = {}

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    session_id = data.get('session_id', '')
    
    if not session_id:
        return jsonify({"error": "Session ID required"}), 400
    
    # Initialize session if new
    if session_id not in sessions:
        sessions[session_id] = {
            "step": "init",
            "name": "",
            "age": 0,
            "gender": "",
            "all_symptoms": [],
            "asked_symptoms": [],
            "diseases": [],
            "current_disease": "",
            "predicted_disease": ""
        }
    
    session = sessions[session_id]
    response = {}
    
    # Initial greeting
    if session["step"] == "init":
        session["step"] = "name"
        response = {"message": "Welcome to the medical chatbot! What is your name?", "type": "text"}
    
    # Get name
    elif session["step"] == "name":
        session["name"] = message
        session["step"] = "age"
        response = {"message": f"Nice to meet you, {message}! How old are you?", "type": "text"}
    
    # Get age
    elif session["step"] == "age":
        try:
            session["age"] = int(message)
            session["step"] = "gender"
            response = {"message": "What is your gender?", "type": "text"}
        except ValueError:
            response = {"message": "Please enter a valid age as a number.", "type": "text"}
    
    # Get gender
    elif session["step"] == "gender":
        session["gender"] = message
        session["step"] = "symptom1"
        response = {
            "message": f"Thank you {session['name']}. Let's identify your condition. What is your main symptom?", 
            "type": "text"
        }
    
    # Get first symptom
    elif session["step"] == "symptom1":
        sym1 = preprocess(message)
        sim1, psym1 = syntactic_similarity(sym1, all_symp_pr)
        
        if sim1 == 1 and psym1:
            # If multiple symptom matches found
            if len(psym1) > 1:
                session["temp_symptoms"] = psym1
                session["step"] = "symptom1_selection"
                symptoms = related_sym(psym1)
                response = {
                    "message": "I found multiple matches. Which one describes your symptom best?",
                    "type": "options",
                    "options": symptoms
                }
            else:
                col_name = col_dict.get(psym1[0])
                if col_name:
                    session["all_symptoms"] = [col_name]
                    session["step"] = "symptom2"
                    response = {"message": "Do you have any other symptoms?", "type": "text"}
                else:
                    response = {"message": "I couldn't find that symptom in my database. Please try another symptom.", "type": "text"}
        else:
            # Try semantic similarity
            sim1, psym1 = semantic_similarity(sym1, all_symp_pr)
            if sim1 > 0 and psym1:
                col_name = col_dict.get(psym1)
                if col_name:
                    session["all_symptoms"] = [col_name]
                    session["step"] = "symptom2"
                    response = {"message": "Do you have any other symptoms?", "type": "text"}
                else:
                    response = {"message": "I couldn't find that symptom in my database. Please try another symptom.", "type": "text"}
            else:
                # Try synonyms
                synms = suggest_syn(sym1)
                if synms:
                    session["suggested_synonyms"] = synms
                    session["step"] = "check_synonym"
                    response = {"message": f"Are you experiencing {synms[0]}?", "type": "yesno"}
                else:
                    response = {"message": "I couldn't understand that symptom. Please try describing it differently.", "type": "text"}
    
    # Handle symptom1 selection from options
    elif session["step"] == "symptom1_selection":
        try:
            selected_id = int(message)
            if "temp_symptoms" in session and 0 <= selected_id < len(session["temp_symptoms"]):
                selected_symptom = session["temp_symptoms"][selected_id]
                col_name = col_dict.get(selected_symptom)
                if col_name:
                    session["all_symptoms"] = [col_name]
                    session["step"] = "symptom2"
                    response = {"message": "Do you have any other symptoms?", "type": "text"}
                else:
                    response = {"message": "I couldn't find that symptom in my database. Please try another.", "type": "text"}
            else:
                response = {"message": "Invalid selection. Please try again.", "type": "text"}
        except ValueError:
            response = {"message": "Please enter a valid number from the options.", "type": "text"}
    
    # Check suggested synonym
    elif session["step"] == "check_synonym":
        if message.lower() in ["yes", "y"]:
            if "suggested_synonyms" in session and session["suggested_synonyms"]:
                sym = session["suggested_synonyms"][0]
                col_name = col_dict.get(sym)
                if col_name:
                    session["all_symptoms"] = [col_name]
                    session["step"] = "symptom2"
                    response = {"message": "Do you have any other symptoms?", "type": "text"}
                else:
                    response = {"message": "I couldn't find that symptom in my database. Please try describing it differently.", "type": "text"}
            else:
                response = {"message": "Let's try again. What is your main symptom?", "type": "text"}
                session["step"] = "symptom1"
        else:
            # Try the next synonym if available
            if "suggested_synonyms" in session and len(session["suggested_synonyms"]) > 1:
                session["suggested_synonyms"] = session["suggested_synonyms"][1:]
                response = {"message": f"Are you experiencing {session['suggested_synonyms'][0]}?", "type": "yesno"}
            else:
                response = {"message": "Let's try again. What is your main symptom?", "type": "text"}
                session["step"] = "symptom1"
    
    # Get second symptom
    elif session["step"] == "symptom2":
        if message.lower() in ["no", "n", "nope"]:
            # Skip to disease prediction if user has no more symptoms
            session["step"] = "predict_disease"
            return chat()
        
        sym2 = preprocess(message)
        sim2, psym2 = syntactic_similarity(sym2, all_symp_pr)
        
        if sim2 == 1 and psym2:
            # If multiple symptom matches found
            if len(psym2) > 1:
                session["temp_symptoms"] = psym2
                session["step"] = "symptom2_selection"
                symptoms = related_sym(psym2)
                response = {
                    "message": "I found multiple matches. Which one describes your symptom best?",
                    "type": "options",
                    "options": symptoms
                }
            else:
                col_name = col_dict.get(psym2[0])
                if col_name and col_name not in session["all_symptoms"]:
                    session["all_symptoms"].append(col_name)
                    session["step"] = "more_symptoms"
                    response = {"message": "Do you have any other symptoms? (yes/no)", "type": "yesno"}
                else:
                    response = {"message": "I already noted that symptom. Do you have any other symptoms? (yes/no)", "type": "yesno"}
                    session["step"] = "more_symptoms"
        else:
            # Try semantic similarity
            sim2, psym2 = semantic_similarity(sym2, all_symp_pr)
            if sim2 > 0 and psym2:
                col_name = col_dict.get(psym2)
                if col_name and col_name not in session["all_symptoms"]:
                    session["all_symptoms"].append(col_name)
                    session["step"] = "more_symptoms"
                    response = {"message": "Do you have any other symptoms? (yes/no)", "type": "yesno"}
                else:
                    response = {"message": "I already noted that symptom. Do you have any other symptoms? (yes/no)", "type": "yesno"}
                    session["step"] = "more_symptoms"
            else:
                response = {"message": "I couldn't understand that symptom. Please try describing it differently.", "type": "text"}
    
    # Handle symptom2 selection from options
    elif session["step"] == "symptom2_selection":
        try:
            selected_id = int(message)
            if "temp_symptoms" in session and 0 <= selected_id < len(session["temp_symptoms"]):
                selected_symptom = session["temp_symptoms"][selected_id]
                col_name = col_dict.get(selected_symptom)
                if col_name and col_name not in session["all_symptoms"]:
                    session["all_symptoms"].append(col_name)
                    session["step"] = "more_symptoms"
                    response = {"message": "Do you have any other symptoms? (yes/no)", "type": "yesno"}
                else:
                    response = {"message": "I already noted that symptom. Do you have any other symptoms? (yes/no)", "type": "yesno"}
                    session["step"] = "more_symptoms"
            else:
                response = {"message": "Invalid selection. Please try again.", "type": "text"}
        except ValueError:
            response = {"message": "Please enter a valid number from the options.", "type": "text"}
    
    # Ask for more symptoms
    elif session["step"] == "more_symptoms":
        if message.lower() in ["yes", "y"]:
            session["step"] = "additional_symptom"
            response = {"message": "Please tell me another symptom:", "type": "text"}
        else:
            session["step"] = "predict_disease"
            return chat()
    
    # Get additional symptoms
    elif session["step"] == "additional_symptom":
        sym = preprocess(message)
        sim, psym = syntactic_similarity(sym, all_symp_pr)
        
        if sim == 1 and psym:
            # If multiple symptom matches found
            if len(psym) > 1:
                session["temp_symptoms"] = psym
                session["step"] = "additional_symptom_selection"
                symptoms = related_sym(psym)
                response = {
                    "message": "I found multiple matches. Which one describes your symptom best?",
                    "type": "options",
                    "options": symptoms
                }
            else:
                col_name = col_dict.get(psym[0])
                if col_name and col_name not in session["all_symptoms"]:
                    session["all_symptoms"].append(col_name)
                    session["step"] = "more_symptoms"
                    response = {"message": "Do you have any other symptoms? (yes/no)", "type": "yesno"}
                else:
                    response = {"message": "I already noted that symptom. Do you have any other symptoms? (yes/no)", "type": "yesno"}
                    session["step"] = "more_symptoms"
        else:
            # Try semantic similarity
            sim, psym = semantic_similarity(sym, all_symp_pr)
            if sim > 0 and psym:
                col_name = col_dict.get(psym)
                if col_name and col_name not in session["all_symptoms"]:
                    session["all_symptoms"].append(col_name)
                    session["step"] = "more_symptoms"
                    response = {"message": "Do you have any other symptoms? (yes/no)", "type": "yesno"}
                else:
                    response = {"message": "I already noted that symptom. Do you have any other symptoms? (yes/no)", "type": "yesno"}
                    session["step"] = "more_symptoms"
            else:
                response = {"message": "I couldn't understand that symptom. Please try describing it differently.", "type": "text"}
    
    # Handle additional symptom selection from options
    elif session["step"] == "additional_symptom_selection":
        try:
            selected_id = int(message)
            if "temp_symptoms" in session and 0 <= selected_id < len(session["temp_symptoms"]):
                selected_symptom = session["temp_symptoms"][selected_id]
                col_name = col_dict.get(selected_symptom)
                if col_name and col_name not in session["all_symptoms"]:
                    session["all_symptoms"].append(col_name)
                    session["step"] = "more_symptoms"
                    response = {"message": "Do you have any other symptoms? (yes/no)", "type": "yesno"}
                else:
                    response = {"message": "I already noted that symptom. Do you have any other symptoms? (yes/no)", "type": "yesno"}
                    session["step"] = "more_symptoms"
            else:
                response = {"message": "Invalid selection. Please try again.", "type": "text"}
        except ValueError:
            response = {"message": "Please enter a valid number from the options.", "type": "text"}
    
    # Predict disease based on collected symptoms
    elif session["step"] == "predict_disease":
        if len(session["all_symptoms"]) > 0:
            # Try to find possible diseases based on symptoms
            possible_dis = possible_diseases(session["all_symptoms"])
            
            if possible_dis:
                # Use the model to predict the disease
                pred = knn_clf.predict(OHV(session["all_symptoms"], all_symp_col))
                session["predicted_disease"] = pred[0]
                session["step"] = "disease_days"
                response = {
                    "message": f"{session['name']}, based on your symptoms, I believe you may have {pred[0]}. How many days have you been experiencing these symptoms?",
                    "type": "text"
                }
            else:
                response = {
                    "message": "I'm sorry, I couldn't determine a specific condition based on the symptoms you provided. Would you like to try again with different symptoms?",
                    "type": "yesno"
                }
                session["step"] = "retry_diagnosis"
        else:
            response = {
                "message": "I need more symptoms to make a diagnosis. Please tell me what symptoms you're experiencing:",
                "type": "text"
            }
            session["step"] = "symptom1"
    
    # Get days of symptoms to assess severity
    elif session["step"] == "disease_days":
        try:
            days = int(message)
            disease = session["predicted_disease"]
            
            # Get condition severity
            condition = calc_condition(session["all_symptoms"], days)
            
            # Get disease description
            description = ""
            if disease in description_list:
                description = description_list[disease]
            
            # Get precautions
            precautions = []
            if disease in precautionDictionary:
                precautions = precautionDictionary[disease]
            
            # Save user data
            user_data = {
                "Name": session["name"],
                "Age": session["age"],
                "Gender": session["gender"],
                "Disease": disease,
                "Symptoms": session["all_symptoms"],
                "Days": days
            }
            write_json(user_data)
            
            # Prepare response
            if condition == 1:
                advice = "You should consult a doctor as soon as possible."
            else:
                advice = "Your condition doesn't appear to be severe, but please take precautions."
            
            response_message = f"Disease: {disease}\n\nDescription: {description}\n\nAdvice: {advice}"
            
            if precautions:
                response_message += "\n\nPrecautions:\n"
                for i, precaution in enumerate(precautions, 1):
                    response_message += f"{i}. {precaution}\n"
            
            session["step"] = "diagnosis_complete"
            response = {
                "message": response_message,
                "type": "diagnosis",
                "disease": disease,
                "description": description,
                "advice": advice,
                "precautions": precautions,
                "severity": condition
            }
        except ValueError:
            response = {"message": "Please enter a valid number of days.", "type": "text"}
    
    # Handle retry diagnosis request
    elif session["step"] == "retry_diagnosis":
        if message.lower() in ["yes", "y"]:
            session["all_symptoms"] = []
            session["step"] = "symptom1"
            response = {"message": "Let's try again. What is your main symptom?", "type": "text"}
        else:
            session["step"] = "diagnosis_complete"
            response = {
                "message": "I understand. If your symptoms persist or worsen, please consult a healthcare professional.",
                "type": "text"
            }
    
    # Diagnosis complete
    elif session["step"] == "diagnosis_complete":
        session["step"] = "new_session"
        response = {
            "message": "Do you need help with anything else? (yes/no)",
            "type": "yesno"
        }
    
    # New session
    elif session["step"] == "new_session":
        if message.lower() in ["yes", "y"]:
            # Keep user info but reset diagnosis data
            name = session["name"]
            age = session["age"]
            gender = session["gender"]
            
            # Reset session
            sessions[session_id] = {
                "step": "symptom1",
                "name": name,
                "age": age,
                "gender": gender,
                "all_symptoms": [],
                "asked_symptoms": [],
                "diseases": [],
                "current_disease": "",
                "predicted_disease": ""
            }
            
            response = {
                "message": f"Hello again, {name}. What symptom are you experiencing?",
                "type": "text"
            }
        else:
            response = {
                "message": f"Thank you for using the medical chatbot, {session['name']}. Take care!",
                "type": "text"
            }
            # Keep the session but mark it as ended
            session["step"] = "ended"
    
    else:
        response = {
            "message": "I'm not sure how to respond to that. Let's start again. What is your main symptom?",
            "type": "text"
        }
        session["step"] = "symptom1"

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5000)