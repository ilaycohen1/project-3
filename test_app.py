from app import show_questions, show_question_by_lvl, add_question
import json
import requests

TEST_URL="http://127.0.0.1:5000/api/questions"

def test_show_questions():
    length_key = json.loads(show_questions())["length"]
    length=len(json.loads(show_questions())["questions"])
    if requests.get(TEST_URL).status_code == 200:
        assert  length_key == length and length != 0 

def test_show_question_by_lvl():
    lvl = 1
    all_levels = json.loads(show_questions())["length"]
    level = json.loads(show_question_by_lvl(lvl))["length"]
    if requests.get(url=f"{TEST_URL}/{lvl}").status_code == 200:
        assert 0 < level < all_levels


def test_add_question():
    test_data = [1, "Is that a question?", "The correct answer", "Option1", "Option2", "Option3"]
    before_length = json.loads(show_questions())["length"]
    response = requests.post(url=f"{TEST_URL}/add", json={"question":test_data})
    if response.status_code == 200:
        result = response.json()
        assert result["status"] == 'Added successfuly'
        assert result["length"] == len(test_data)
        assert before_length < json.loads(show_questions())["length"]

def test_update_question():
    test_data = [0, "Was this question updated?", "Yes", "No", "Maybe", "Dunno"]
    response = requests.put(url=f"{TEST_URL}/update/1", json={"question":test_data})
    if response.status_code == 200:
        result = response.json()
        assert result["status"] == "Updated question 1"
        assert result["length"] == len(test_data)

def test_delete_question():
    response = requests.delete(url=f"{TEST_URL}/delete/0")
    if response.status_code == 200:
        result = response.json()
        assert result["status"] == "Deleted question 0" or result["status"] == "Question 0 doesn't exist"
        assert result["length"] - result["original_length"] == -1
