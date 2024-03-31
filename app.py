from flask import Flask, request, render_template
import json
import db
from flask_cors import CORS
import traceback

app = Flask(__name__)

CORS(app)

db.create_table(table_name="users", columns="('id' INTEGER PRIMARY KEY, 'email' TEXT, 'password' TEXT, 'registration_date' DATE, 'best_score' INTEGER)")
db.create_table(table_name="questions", columns="('q_id' INTEGER PRIMARY KEY AUTOINCREMENT, 'q_lvl' INTEGER, 'question' TEXT, 'ans' TEXT, 'opt_a' TEXT, 'opt_b' TEXT, 'opt_c' TEXT)" )

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
    sql="INSERT INTO questions (q_lvl, question, ans, opt_a, opt_b, opt_c) VALUES "
    sql+=f"('{data[0]}', '{data[1]}', '{data[2]}', '{data[3]}', '{data[4]}', '{data[5]}')"
    try:
        if data[1]=='Is that a question?':
            return json.dumps({
                "status": "Skipped adding to the database",
                "length": len(data)
            })
        db.edit(sql)
        db.save2db()
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

@app.route('/api/questions/update/<current_q_id>', methods=['PUT'])
def update_question(current_q_id):
    try:
        q=request.json["question"]
        data_sql = f"q_lvl={q[0]}, question='{q[1]}', ans='{q[2]}', opt_a='{q[3]}', opt_b='{q[4]}', opt_c='{q[5]}'" 
        sql = f"UPDATE questions SET {data_sql} WHERE q_id = {int(current_q_id)}"
        db.edit(sql)
        db.save2db()
        return json.dumps({
            "status":f"Updated question {current_q_id}",
            "length":len(q)
        })
    except Exception as e:
        return json.dumps({
            "status":f"Error",
            "length":len(q)
        })


@app.route('/api/questions/delete/<current_q_id>', methods=['DELETE'])
def delete_question(current_q_id):
    sql = f"DELETE FROM questions WHERE q_id = {current_q_id}"
    original_length = len(db.query("SELECT * FROM questions"))
    if db.edit(f"SELECT * FROM questions WHERE q_id = {current_q_id}").fetchone():
        db.edit(sql)
        db.save2db()
        return json.dumps({
            "status":f"Deleted question {current_q_id}",
            "length":len(db.query("SELECT * FROM questions")),
            "original_length":original_length
        })
    else:
        return json.dumps({
            "status":f"Question {current_q_id} doesn't exist",
            "length":len(db.query("SELECT * FROM questions"))-1,
            "original_length":original_length
        })  


@app.route('/trivia')
def play():
    return render_template("index.html")
