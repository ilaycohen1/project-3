from flask import Flask, request
import json
import db

app = Flask(__name__)

db.create_table(table_name="users", columns="('id' INTEGER PRIMARY KEY, 'email' TEXT, 'password' TEXT, 'registration_date' DATE, 'best_score' INTEGER)")
db.create_table(table_name="questions", columns="('q_id' INTEGER PRIMARY KEY, 'q_lvl' INTEGER, 'question' TEXT, 'ans' TEXT, 'opt_a' TEXT, 'opt_b' TEXT, 'opt_c' TEXT)" )

@app.route('/api/questions', methods=['GET'])
def show_questions():
    tuples = db.query("SELECT * FROM questions")
    data = db.tuples2json(tuples)
    return json.dumps({
            "questions":data,
            "length":len(data)
    })


@app.route('/api/questions/<current_q_lvl>', methods=['GET'])
def show_question_by_lvl(current_q_lvl):
    tuples = db.query(f"SELECT * FROM questions WHERE q_lvl == {current_q_lvl}")
    data = db.tuples2json(tuples)
    return json.dumps({
        "questions": data,
        "length" : len(data)
    })


@app.route('/api/questions/add', methods=['POST'])
def add_question():
    data=request.json["question"]
    sql="INSERT INTO questions (q_id, q_lvl, question, ans, opt_a, opt_b, opt_c) VALUES "
    for q in data:
        sql+=f"({q[0]}, {q[1]}, {q[2]}, {q[3]}, {q[4]}, {q[5]}, {q[6]})"
    try:
        db.query(sql)
        return json.dumps({
            "status":"Added successfuly",
            "length":len(data)
        })
    except Exception as e:
        print(e)
        return json.dumps({
            "status":"Error",
            "length":-1
        })

