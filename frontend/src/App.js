import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";

const sumarticles = [
    {
        id: 1,
        title: "Emperor Penguins are now endangered, warn biologists",
        read_time: "2",
        summary: "sample summary",
        hyperlink: "https://www.telegraph.co.uk/news/earth/environment/climatechange/10933964/Emperor-Penguins-are-now-endangered-warn-biologists.html"
    },
    {
        id: 2,
        title: "Blondes 'to die out in 200 years'",
        read_time: "2",
        summary: "sample summary",
        hyperlink: "http://news.bbc.co.uk/2/hi/health/2284783.stm"
    }
];
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            activateItem: {
                title: "",
                hyperlink: ""
            },
            sumarticleList: sumarticles
        };
    }
    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };
    handleSubmit = item => {
        this.toggle();
        console.log("save" + JSON.stringify(item));
    };
    handleDelete = item => {
        console.log("delete" + JSON.stringify(item));
    };
    createItem = () => {
        const item = { title: "", hyperlink: "" };
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
                    <a href={item.hyperlink} target="_blank" className="btn btn-outline-primary mr-2"> Link </a>
                    <button className="btn btn-outline-secondary mr-2"> Edit </button>
                    <button className="btn btn-outline-danger"> Delete </button>
                </td>
            </tr>
        ));
    };
    render() {
        return (
            <main className="content">
                <h1 className="text-white text-uppercase text-center my-4">RESEARCH HELPER</h1>
                <div className="col-lg-11 mx-auto p-0">
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
