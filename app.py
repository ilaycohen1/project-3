from flask import Flask, request, jsonify
import json
import db
from flask_cors import CORS

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
    sql="INSERT INTO questions (q_id, q_lvl, question, ans, opt_a, opt_b, opt_c) VALUES "
    sql+=f"('{data[1]}', '{data[2]}', '{data[3]}', '{data[4]}', '{data[5]}', '{data[6]}')"
    try:
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
    q=request.json["question"][0]
    data_sql = f"q_lvl={q[0]}, question={q[1]}, ans={q[2]}, opt_a={q[3]}, opt_b={q[4]}, opt_c={q[5]}" 
    sql = f"UPDATE questions SET {data_sql} WHERE q_id = {current_q_id}"
    db.query(sql)
    db.save2db()
    return json.dumps({
        "status":f"Updated question {current_q_id}",
        "length":len(q)
    })


@app.route('/api/questions/delete/<current_q_id>', methods=['DELETE'])
def delete_question(current_q_id):
    sql = f"DELETE FROM questions WHERE q_id = {current_q_id}"
    original_length = len(db.query("SELECT * FROM questions"))
    db.edit(sql)
    db.save2db()
    return json.dumps({
        "status":f"Deleted question {current_q_id}",
        "length":len(db.query("SELECT * FROM questions")),
        "original_length":original_length
    })


# @app.route('/api/questions/add', methods=['GET'])
# def add_question_front():
#     q_lvl = request.args["question"]
#     question = request.args["question"]
#     data = [0,1, "Is that a question?", "The correct answer", "Option1", "Option2", "Option3"]
#     # response = requests.post(url=f"{TEST_URL}/add", json={"question":test_data})
#     question = input("enter question")

