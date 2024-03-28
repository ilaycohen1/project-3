
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
    

    
    function Main(){
        return (
            <div>
                <Question lvl={1}/>
                <AddQuestionForm/>
            </div>
        )
    }

    root.render(<Main lvl={localStorage.getItem("lvl")}/>)