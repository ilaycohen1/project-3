
    const root=ReactDOM.createRoot(document.getElementById("main"));
    localStorage.setItem("lvl", "1")

    
    
    function Question(){
        const [qIndex, setQIndex] = React.useState(0)
        const [questions, setQuestions] = React.useState([]);
        const [lvl, setLvl] = React.useState(parseInt(localStorage.getItem("lvl")));
        const [message, setMessage] = React.useState(null);

        
        let currentQ = questions[qIndex] 

        React.useEffect(() => {
            const fetchQuestions = async () => {
                    const response = await axios.get(`http://127.0.0.1:5000/api/questions/${lvl}`);
                    setQuestions(response.data.questions);
            };
    
            fetchQuestions();
            console.log(questions);
            console.log(qIndex);
        }, [lvl, qIndex]);

        function checkAns(e, currentQ) {
            if (e.target.textContent==currentQ.ans){
                e.target.style.backgroundColor="green";
                setMessage(lvl==9?"Congrats, you have completed all of the levels! Yow win!":null);
                setLvl(lvl+1);
            }
            else {e.target.style.backgroundColor="red";
            setQIndex(qIndex+1 == questions.length ? 0 : qIndex + 1);
            }
        }

        return (
            <div className="question-container">
                <h2>{message}</h2>
                <h1 className="question">{JSON.stringify(currentQ ? currentQ.question : "Loading...")}</h1>
                <div className="answer-options">
                    <div onClick={(e) => checkAns(e, currentQ)} className="optionalAns">{currentQ ? currentQ.opt_a : "Loading..."}</div>
                    <div onClick={(e) => checkAns(e, currentQ)} className="optionalAns">{currentQ ? currentQ.opt_b : "Loading..."}</div>
                    <div onClick={(e) => checkAns(e, currentQ)} className="optionalAns">{currentQ ? currentQ.opt_c : "Loading..."}</div>
                </div>
            </div>
        )
    }
    

    function AddQuestionForm(){
        const [q_lvl,setQ_lvl] = React.useState("");
        const [q_q,setQ_q] = React.useState("");
        const [q_ans,setQ_ans] = React.useState("");
        const [q_optA,setQ_optA] = React.useState("");
        const [q_optB,setQ_optB] = React.useState("");
        const [q_optC,setQ_optC] = React.useState("");

        function addQ(){
            const data ={"question":[q_lvl, q_q, q_ans, q_optA, q_optB, q_optC]};
            fetch(`http://127.0.0.1:5000/api/questions/add`, {
                method:'POST', 
                cache: 'no-cache', 
                body:JSON.stringify(data), 
                headers : {'dataType': "json", 'Content-Type': 'application/json'},
                redirect: 'follow',
                referrerPolicy: 'no-referrer'
            }).then(response=>{console.log(response.status)})
        }
        
        return (
            <div>
                <div id="add-form" style={{display: "none"}}>
                    <input onChange={(e)=>{setQ_lvl(e.target.value);}} className="lvl-input" placeholder="Level"></input>
                    <input onChange={(e)=>{setQ_q(e.target.value);}} className="question-input" placeholder="Enter your question"></input>
                    <input onChange={(e)=>{setQ_optA(e.target.value);}} className="optA-input" placeholder="Enter option 1"></input>
                    <input onChange={(e)=>{setQ_optB(e.target.value);}} className="optB-input" placeholder="Enter option 2"></input>
                    <input onChange={(e)=>{setQ_optC(e.target.value);}} className="optC-input" placeholder="Enter option 3"></input>
                    <input onChange={(e)=>{setQ_ans(e.target.value);}} className="answer-input" placeholder="Enter the correct answer again"></input>
                    <button onClick={addQ}>Add</button>
                </div>
                    <button onClick={()=>{document.getElementById("add-form").style.display=="flex"?document.getElementById("add-form").style.display="none":document.getElementById("add-form").style.display="flex"}}>ADD</button>
            </div>
        )
    } 
    

    function DeleteQuestion(){
        const [questions, setQuestions] = React.useState([]);
        const [selected_q, setSelected_q] = React.useState("");

        React.useEffect(()=>{
            let questionsData=[]
            axios.get(`http://127.0.0.1:5000/api/questions`).then(response=>{
                response.data.questions.map(item => questionsData.push({
                "q" :item.question,
                "id" : item.q_id,
                "lvl":item.q_lvl,
                "answer":item.q_ans,
                "optA":item.opt_a,
                "optB":item.opt_b,
                "optC":item.opt_c}));
                setQuestions(questionsData);
            })
            
        },[selected_q])

        
        function deleteQ(){  
            axios.delete(`http://127.0.0.1:5000/api/questions/delete/${selected_q}`).then(response => {
                console.log('Status:', response.data.status);})
                setQuestions(questions.filter(item => item.id !== selected_q));
        }

        return (
            <div>
                <div id="delete-form" style={{display: "none"}}>
                    <select value={selected_q} onChange={(e) => setSelected_q(e.target.value)}>
                        <option value="">Select a question to delete</option>
                        {questions.map(item => (
                            <option key={item.id} value={item.id}>{item.q}</option>
                        ))}
                    </select>
                    <button onClick={deleteQ}>Delete</button>
                </div>
                <button onClick={()=>{document.getElementById("delete-form").style.display=="flex"?document.getElementById("delete-form").style.display="none":document.getElementById("delete-form").style.display="flex"}}>DELETE</button>
            </div>
        )
    }
    


    function UpdateQuestion(){
        const [questions, setQuestions] = React.useState([]);
        const [selected_q, setSelected_q] = React.useState({"id":"", "q":"Select a question", "lvl":"", "answer":"", "optA":"", "optB":"", "optC":""});
        const [q_lvl,setQ_lvl] = React.useState("");
        const [q_q,setQ_q] = React.useState("");
        const [q_ans,setQ_ans] = React.useState("");
        const [q_optA,setQ_optA] = React.useState("");
        const [q_optB,setQ_optB] = React.useState("");
        const [q_optC,setQ_optC] = React.useState("");


        React.useEffect(()=>{
            let questionsData=[]
            axios.get(`http://127.0.0.1:5000/api/questions`).then(response=>{
                response.data.questions.map(item => questionsData.push({
                "id" :item.q_id,
                "q" :item.question,
                "lvl":item.q_lvl,
                "answer":item.ans,
                "optA":item.opt_a,
                "optB":item.opt_b,
                "optC":item.opt_c}));
                setQuestions(questionsData);
            })
            
        },[selected_q, q_lvl, q_q, q_ans])

        
        function updateQ(){  
            axios.put(`http://127.0.0.1:5000/api/questions/update/${selected_q.id}`,
            {
                "question" : [q_lvl, q_q, q_ans, q_optA, q_optB, q_optC]
            }, 
            {
                headers : {
                    'dataType': "json",
                    'Content-Type': 'application/json'
                }
            },
            ).then(response => {
                console.log('Status:', response.data.status);})
        }

        return (
            <div>
                <div id="update-form" style={{display: "none"}}>
                    <select value={selected_q.id} onChange={(e) => setSelected_q(
                        questions.find(item=>item.id==parseInt(e.target.value))
                    )}>
                        <option value={selected_q.id}>{selected_q.q}</option>
                            {questions.map(item => (
                                <option key={item.id} value={item.id}>{item.q}</option>
                        ))}
                    </select>
                    <div>
                    <div>Level:</div><input onChange={(e)=>{setQ_lvl(parseInt(e.target.value));}} className="lvl-input" placeholder={selected_q.lvl}></input>
                    <div>Question:</div><input onChange={(e)=>{setQ_q(e.target.value);}} className="question-input" placeholder={selected_q.q}></input>
                    <div>Option A:</div><input onChange={(e)=>{setQ_optA(e.target.value);}} className="optA-input" placeholder={selected_q.optA}></input>
                    <div>Option B:</div><input onChange={(e)=>{setQ_optB(e.target.value);}} className="optB-input" placeholder={selected_q.optB}></input>
                    <div>Option C:</div><input onChange={(e)=>{setQ_optC(e.target.value);}} className="optC-input" placeholder={selected_q.optC}></input>
                    <div>Answer:</div><input onChange={(e)=>{setQ_ans(e.target.value);}} className="answer-input" placeholder={selected_q.answer}></input>
                    <button onClick={updateQ}>Update</button>
                    </div>
                </div>
                <button onClick={()=>{document.getElementById("update-form").style.display=="flex"?document.getElementById("update-form").style.display="none":document.getElementById("update-form").style.display="flex"}}>UPDATE</button>
            </div>
        )
    }

    function Navbar(){
        return (
            <div className="navbar">
                <AddQuestionForm/>
                <UpdateQuestion/>
                <DeleteQuestion/>
            </div>
            
        )
    }


    function Main(){
        return (
            <div>
                <Navbar/>
                <Question lvl={1}/>
            </div>
        )
    }

    root.render(<Main lvl={localStorage.getItem("lvl")}/>)