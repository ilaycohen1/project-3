from flask import Flask, request
import json
import db

app = Flask(__name__)

db.create_table(table_name="users", columns="('id' INTEGER PRIMARY KEY, 'email' TEXT, 'password' TEXT, 'registration_date' DATE, 'best_score' INTEGER)")
db.create_table(table_name="questions", columns="('q_id' INTEGER PRIMARY KEY, 'q_lvl' INTEGER, 'question' TEXT, 'ans' TEXT, 'opt_a' TEXT, 'opt_b' TEXT, 'opt_c' TEXT)" )

@app.route('/api/questions', methods=['GET'])
def show_questions():
    tuples = db.query("SELECT q_id, q_lvl, question, ans, opt_a, opt_b, opt_c FROM questions")
    data = db.tuples2json(tuples)
    return json.dumps({
            "questions":data
    })


@app.route('/api/questions/<current_q_lvl>', methods=['GET'])
def show_question_by_lvl(current_q_lvl):
    tuples = db.query(f"SELECT q_id, q_lvl, question, opt_a, opt_b, opt_c, ans FROM questions WHERE q_lvl == {current_q_lvl}")
    data = db.tuples2json(tuples)
    return json.dumps({
        "questions": data,
        "length" : len(data)
    })

