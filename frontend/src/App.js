import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            activateItem: {
                title: "",
                hyperlink: ""
            },
            sumarticleList: []
        };
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        axios
            .get("http://localhost:8000/api/sumarticles/")
            .then(res => this.setState({ sumarticleList: res.data }))
            .catch(err => console.log(err));
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };
    handleSubmit = item => {
        console.log("Submit button clicked");
        this.toggle();
        if (item.id) {
            axios
                .put(`http://localhost:8000/api/sumarticles/${item.id}/`, item)
                .then(res => this.refreshList());
        }
        else {
            axios
                .post("http://localhost:8000/api/sumarticles/", item, {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    }
                })
                .then(res => this.refreshList())
                .catch(err => console.log(err));
        }
        console.log("saved " + JSON.stringify(item));
    };
    handleDelete = item => {
        console.log("Delete button clicked");
        if (item.id) {
            axios
                .delete(`http://localhost:8000/api/sumarticles/${item.id}/`)
                .then(res => this.refreshList());
            console.log("deleted " + JSON.stringify(item));
        }
        else {
            console.log("Invalid article");
        }
    };
    createItem = () => {
        const item = { title: "", read_time: 0, summary: "", hyperlink: "" };
        this.setState({ activeItem: item, modal: !this.state.modal });
    };
    editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    }
    renderItems = () => {
        const newItems = this.state.sumarticleList;

        return newItems.map(item => (
            <tr key={item.id}>
                <td> {item.title} </td>
                <td> {item.read_time} </td>
                <td> {item.summary} </td>
                <td>
                    <a href={item.hyperlink} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary mr-2"> Link </a>
                    <button onClick={() => this.editItem(item)} className="btn btn-outline-secondary mr-2"> Edit </button>
                    <button onClick={() => this.handleDelete(item)} className="btn btn-outline-danger"> Delete </button>
                </td>
            </tr>
        ));
    };
    render() {
        return (
            <main className="content">
                <h1 className="text-white text-center my-4">RESEARCH HELPER</h1>
                <div className="col-lg-11 mx-auto p-0" style={{"marginBottom": "1em"}}>
                    <div className="card p-3">
                        <div className="">
                            <button onClick={this.createItem} className="btn btn-warning">Add article</button>
                        </div>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Article Title</th>
                                    <th scope="col">Read Time (min)</th>
                                    <th scope="col">Summary</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderItems()}
                            </tbody>
                        </table>
                    </div>
                </div>
                {this.state.modal ? (
                    <Modal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ) : null}
            </main>
        );
    }
}
export default App;
