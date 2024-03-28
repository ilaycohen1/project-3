import sqlite3

DB_NAME = "trivia.db"

def create_table(table_name, columns:str="('id' INTEGER PRIMARY KEY, 'email' TEXT, 'password' TEXT, 'registration_date' DATE, 'best_score' INTEGER)"):
    """
    Keyword arguments: table_name, columns
    table_name -- the name of the table you are creating.
    columns -- the columns of the table in the format '('column' column_type)'
    Return: this function creates a table in the db.
    """
    with sqlite3.connect(DB_NAME) as conn:
        cur=conn.cursor()
        cur.execute(f"CREATE TABLE IF NOT EXISTS {table_name} {columns}")

def query(sql):
    """
    Keyword arguments: sql
    sql -- the sql query you want to execute.
    Return: this function executes the sql you type in.
    """
    with sqlite3.connect(DB_NAME) as conn:
        cur = conn.cursor()
        return cur.execute(sql).fetchall()
    
def edit(sql):
    """
    Keyword arguments: sql
    sql -- the sql query you want to execute.
    Return: this function executes the sql you type in.
    """
    with sqlite3.connect(DB_NAME) as conn:
        cur = conn.cursor()
        return cur.execute(sql)
    
def tuples2json(tuples):
    data = [{f"q_id": f"{t[0]}", "q_lvl": f"{t[1]}", "question": f"{t[2]}", "ans": f"{t[3]}", "opt_a": f"{t[4]}", "opt_b": f"{t[5]}", "opt_c": f"{t[6]}"} for t in tuples]
    return data

def save2db():
    with sqlite3.connect(DB_NAME) as conn:
        conn.commit()


