
    const root=ReactDOM.createRoot(document.getElementById("main"));
    localStorage.setItem("lvl", "1")

    
    
    function Question(){
        const [qIndex, setQIndex] = React.useState(0)
        const [questions, setQuestions] = React.useState([]);
        const [lvl, setLvl] = React.useState(parseInt(localStorage.getItem("lvl")))
        
        let currentQ = questions[qIndex]

        React.useEffect(()=>{
            axios.get(`http://127.0.0.1:5000/api/questions/${lvl}`).then(response=>{
                let questionsData=response.data.questions;
                setQuestions(questionsData);})
        },[lvl, qIndex])

        function checkAns(e, currentQ) {
            if (e.target.textContent==currentQ.ans){
                e.target.style.backgroundColor="green";
                setLvl(lvl+1);
            }
            else {e.target.style.backgroundColor="red";}
            setQIndex(qIndex+1 == questions.length ? 0 : qIndex + 1);
        }

        return (
            <div className="question-container">
                <div className="question">{JSON.stringify(currentQ ? currentQ.question : "Loading...")}</div>
                <button onClick={(e) => checkAns(e, currentQ)} className="optionalAns">{currentQ ? currentQ.opt_a : "Loading..."}</button>
                <button onClick={(e) => checkAns(e, currentQ)} className="optionalAns">{currentQ ? currentQ.opt_b : "Loading..."}</button>
                <button onClick={(e) => checkAns(e, currentQ)} className="optionalAns">{currentQ ? currentQ.opt_c : "Loading..."}</button>
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
            const data ={"question":[0, q_lvl, q_q, q_ans, q_optA, q_optB, q_optC]};
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
                <input onChange={(e)=>{setQ_lvl(e.target.value);}} className="lvl-input" placeholder="Enter your question"></input>
                <input onChange={(e)=>{setQ_q(e.target.value);}} className="question-input" placeholder="Enter your question"></input>
                <input onChange={(e)=>{setQ_optA(e.target.value);}} className="optA-input" placeholder="Enter option 1"></input>
                <input onChange={(e)=>{setQ_optB(e.target.value);}} className="optB-input" placeholder="Enter option 2"></input>
                <input onChange={(e)=>{setQ_optC(e.target.value);}} className="optC-input" placeholder="Enter option 3"></input>
                <input onChange={(e)=>{setQ_ans(e.target.value);}} className="answer-input" placeholder="Enter the correct answer again"></input>
                <button onClick={addQ}>image</button>
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
                <h2>Delete Question</h2>
                <select value={selected_q} onChange={(e) => setSelected_q(e.target.value)}>
                    <option value="">Select a question to delete</option>
                    {questions.map(item => (
                        <option key={item.id} value={item.id}>{item.q}</option>
                    ))}
                </select>
                <button onClick={deleteQ}>Delete</button>
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
            
        },[selected_q])

        
        function updateQ(){  
            axios.put(`http://127.0.0.1:5000/api/questions/update/${selected_q.id}`, {
                "question" : [q_lvl, q_q, q_ans, q_optA, q_optB, q_optC]}, {headers : {'dataType': "json", 'Content-Type': 'application/json'}},
            ).then(response => {
                console.log('Status:', response.data.status);})
        }

        return (
            <div>
                <div id="update-form" style={{display: "none"}}>
                    <h2>Update Question</h2>
                    <select value={selected_q.q} onChange={(e) => setSelected_q(
                        questions.find(item=>item.id==parseInt(e.target.value))
                    )}>
                        <option value="">{selected_q.q}</option>
                            {questions.map(item => (
                                <option key={item.id} value={item.id}>{item.q}</option>
                        ))}
                    </select>
                    <div>
                    <input onChange={(e)=>{setQ_lvl(parseInt(e.target.value));}} className="lvl-input" placeholder={selected_q.lvl}></input>
                    <input onChange={(e)=>{setQ_q(e.target.value);}} className="question-input" value={selected_q.q}></input>
                    <input onChange={(e)=>{setQ_optA(e.target.value);}} className="optA-input" value={selected_q.optA}></input>
                    <input onChange={(e)=>{setQ_optB(e.target.value);}} className="optB-input" value={selected_q.optB}></input>
                    <input onChange={(e)=>{setQ_optC(e.target.value);}} className="optC-input" value={selected_q.optC}></input>
                    <input onChange={(e)=>{setQ_ans(e.target.value);}} className="answer-input" value={selected_q.answer}></input>
                    <button onClick={updateQ}>UPDATE</button>
                    </div>
                </div>
                <button onClick={()=>{document.getElementById("update-form").style.display=="flex"?document.getElementById("update-form").style.display="none":document.getElementById("update-form").style.display="flex"}}>Update</button>
            </div>
        )
    }


    function Main(){
        return (
            <div>
                <Question lvl={1}/>
                <AddQuestionForm/>
                <DeleteQuestion/>
                <UpdateQuestion/>
            </div>
        )
    }

    root.render(<Main lvl={localStorage.getItem("lvl")}/>)