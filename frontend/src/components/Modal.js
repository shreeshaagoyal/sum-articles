import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap";

export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem
        };
    }
    handleChange = e => {
        let { name, value } = e.target;
        if (e.target.type === "checkbox") {
            value = e.target.checked;
        }
        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
    };

    render() {
        const { toggle, onSave } = this.props;
        return (
            <Modal isOpen={true} toggle={toggle} autoFocus={false}>
                <ModalHeader toggle={toggle}> Add new article to research library </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="title">Article Title</Label>
                            <Input
                                autoFocus={true}
                                type="text"
                                name="title"
                                value={this.state.activeItem.title}
                                onChange={this.handleChange}
                                placeholder="Enter article title"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="hyperlink">Link</Label>
                            <Input
                                type="text"
                                name="hyperlink"
                                value={this.state.activeItem.hyperlink}
                                onChange={this.handleChange}
                                onKeyPress={event => {
                                    if (event.key === "Enter") {
                                        onSave(this.state.activeItem);
                                    }
                                }}
                                placeholder="Enter article hyperlink"
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => onSave(this.state.activeItem)}>
                        Save
            </Button>
                </ModalFooter>
            </Modal>
        );
    }
}