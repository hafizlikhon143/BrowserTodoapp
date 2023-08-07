import React, { Component } from 'react';
import "../css/style.css";
import AMP3 from '../ringtone.mp3';

class Main extends Component {
    state = {
        todoNum: Number(this.getCookie("todo_num")) ,
        valu: [],
        num_l: 0,
        dltBtn: `<button class='dlt_btn'>DELETE</button>`,
        innervelId: setInterval(console.log("Hello"), 10000),
        notification: "",
    }

    main_audio = new Audio(AMP3);
    componentDidMount() {
        var notification = Notification.requestPermission();
        this.setState({notification: notification})
        console.log(document.cookie);
        var all_val = this.getAllCookieValue();
        var all_val2 = this.getAllCookieValue2();
        var num_l = 1;
        all_val.forEach((e, index)=>{
            if (e !== "" && all_val2[index].includes("_time") !== true) {
                var todoList = document.querySelector("#ItemsList");
                var todoinput = e;
                var newElem = document.createElement("li");
                // Create New Element and Append it to the List
                newElem.innerHTML = `<span class="list_text" data-todoid=${all_val2[index]} data-id=${num_l}>${todoinput}</span><span class="todo_time" data-todoid=${all_val2[index]}>${all_val[index + 1]}</span>  ${this.state.dltBtn}`;
                newElem.classList.add("ItemList");
                todoList.appendChild(newElem);
            }
            num_l += 1;
        })
        this.setState({
            num_l: num_l
        })
        this.dltFunc();
        this.timeInnerval();
    }
    dltFunc() {
        var dltBtns = document.querySelectorAll(".dlt_btn");
        dltBtns.forEach(dltBtn => {
            dltBtn.addEventListener('click', e => {
                const confirmation = window.confirm("Do you want to Delete This todo");
                if (confirmation == true) {
                    var parElemData = e.target.previousElementSibling.previousElementSibling.dataset.id;
                    var parElemDataId = e.target.previousElementSibling.previousElementSibling.dataset.todoid;
                    var parElem = document.querySelector(`.list_text[data-id="${parElemData}"]`);
                    parElem.parentElement.remove();
                    this.setCookie(parElemDataId, "", 0);
                    this.setCookie(parElemDataId + "_time", "", 0);
                    console.log("Removed");
                }
            } )
        })
    }
    timeInnerval = () =>{ setInterval(e => {
                    var time = new Date();
                    var timeNowHour = time.getHours();
                    var timeNowMinute = time.getMinutes();
                    var readableTime = `${timeNowHour}:${timeNowMinute}`;
                    var timeList = document.querySelectorAll(".todo_time");
                    timeList.forEach(e => {
                        if (e.innerHTML === readableTime) {
                            this.main_audio.play();
                            this.state.notification.then(perm => {
                                if (perm === "granted") {
                                    new Notification("Your Time is On", {
                                        tag: "Alarm"
                                    })
                                }
                            })
                        }
                    else {
                        this.main_audio.pause();
                        }
                    }
                    )
                }, 1000)};
    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    getAllCookieValue() {
        let cookieList = []
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++){
            let c = ca[i];
            if (c.split("=")[0].trim() !== "todo_num") {
                cookieList.push(c.split("=")[1]);
            }
        }
        return cookieList;
    }
    getAllCookieValue2() {
        let cookieList = []
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++){
            let c = ca[i];
            if (c.split("=")[0].trim() !== "todo_num") {
                cookieList.push(c.split("=")[0]);
            }
        }
        return cookieList;
    }
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
        }
        return "";
    }
    todoInput = e => {
        e.preventDefault();
        var todoList = document.querySelector("#ItemsList");
        var todoinput = document.querySelector("#todo_text").value;
        var todotimeinput = document.querySelector("#todo_time").value;
        var newElem = document.createElement("li");
        // Create New Element and Append it to the List
        newElem.innerHTML = `<span class="list_text" data-todoid="todo${this.state.todoNum}" data-id=${this.state.num_l+1}>${todoinput}</span><span class="todo_time"  data-todoid="todo${this.state.todoNum}">${todotimeinput}</span> ${this.state.dltBtn}`;
        newElem.classList.add("ItemList");
        todoList.appendChild(newElem);
        this.setState({ todoNum: this.state.todoNum + 1 });
        this.setCookie(`todo_num`, Number(this.state.todoNum)+1, 2)
        this.setCookie(`${"todo"+this.state.todoNum}`, todoinput, 2)
        this.setCookie(`${"todo"+this.state.todoNum+"_time"}`, todotimeinput, 2)
        // Reset Input
        document.querySelector("#todo_text").value = "";
        this.setState({num_l: this.state.num_l + 1})
        this.dltFunc();
    }
    render() { 
        return <React.Fragment>
            <h1>Todo List</h1>
            <div className="container" style={{margin: "auto", textAlign: 'center'}}>
                Input the text in Input box to add the Item In the Todo List.
            </div>
            <form action="" className="container" id="todoInput" onSubmit={this.todoInput}>
                <input type="text" name="" id="todo_text" required />
                <input type="time" name="todo-time" id="todo_time" required />
                <input type="submit" value="Add" id="submit_btn" />
            </form>
            <div className="container">
                <ul id='ItemsList'>

                </ul>
            </div>
        </React.Fragment>;
    }
}
export default Main;