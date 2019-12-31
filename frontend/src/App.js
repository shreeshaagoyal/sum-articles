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
                .then(res => {
                    this.refreshList();
                    this.summarizeItem(item);
                });
        }
        else {
            axios
                .post("http://localhost:8000/api/sumarticles/", item)
                .then(res => {
                    this.refreshList();
                    this.summarizeItem(res.data);
                })
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
        const item = { title: "", read_time: 0, summary: "...", hyperlink: "" };
        this.setState({ activeItem: item, modal: !this.state.modal });
    };
    editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };
    
    // TODO: rearrange UX for how summarization is done?
    // TODO: decouple summarization and read time estimation
    summarizeItem = item => {
        axios
            // Sends the hyperlink of the article to the exposed API endpoint for analysis
            .get(`http://localhost:8000/test/?id=${item.hyperlink}`)
            .then(res => {
                let summary;
                if (res.data.data[1] === "") {
                    summary = "Sorry, could not summarize.";
                } else {
                    summary = res.data.data[1];
                }
                console.log(summary);
                axios
                    // GET request returns an array
                    // First element is the calculated read time in minutes
                    // Second elmeent is the summary
                    // We update the `read_time` and `summary` fields of the item in the db
                    .put(`http://localhost:8000/api/sumarticles/${item.id}/`, {
                        title: item.title,
                        read_time: res.data.data[0],
                        summary: summary,
                        hyperlink: item.hyperlink
                    })
                    .then(res => this.refreshList())
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    };
    renderItems = () => {
        const newItems = this.state.sumarticleList;

        return newItems.map(item => (
            <tr key={item.id}>
                <td> {item.title} </td>
                <td> {item.read_time} </td>
                <td> {item.summary} </td>
                <td>
                    <div title="Go to article">
                        <a href={item.hyperlink} target="_blank" rel="noopener noreferrer">
                            <i className="fa fa-external-link icon"></i>
                        </a>
                    </div>
                </td>
                <td> <div title="Edit"> <i onClick={() => this.editItem(item)} className="fa fa-edit icon"></i> </div> </td>
                <td> <div title="Delete"> <i onClick={() => this.handleDelete(item)} className="fa fa-trash icon"></i> </div> </td>
            </tr>
        ));
    };
    render() {
        return (
            <main className="content">
                <div className="typewriter">
                    <h1 className="text-white text-center my-5 typewriter-text">ResearchLib</h1>
                </div>
                <div className="col-lg-11 mx-auto" style={{"padding": "0 0 1em 0"}}>
                    <div className="card p-3">
                        <div style={{"marginBottom": "1em"}}>
                            <button title="Add new article" onClick={this.createItem} className="btn btn-primary btn-circle-lg">
                                <i className="fa fa-plus icon"></i>
                            </button>
                        </div>
                        <table className="table table-hover">
                            <thead className="thead">
                                <tr>
                                    <th scope="col" style={{"width": "10em"}}>Article Title</th>
                                    <th scope="col" style={{"width": "8em"}}>Read Time (min)</th>
                                    <th scope="col">Summary</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
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
