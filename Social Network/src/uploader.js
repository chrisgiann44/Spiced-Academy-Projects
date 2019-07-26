import React from "react";
import axios from "./axios";

export class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async upload() {
        var formData = new FormData();
        formData.append("file", this.state.file);
        const imageUrl = await axios.post("/upload", formData);
        await this.props.changeImage(imageUrl.data.imageUrl);
    }

    handleChange(e) {
        this.setState({
            file: e.target.files[0]
        });
    }

    render() {
        return (
            <div>
                <p onClick={this.props.clickHandler}> x </p>
                <h2> Want to change your Image? </h2>
                <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={e => this.handleChange(e)}
                />
                <button
                    onClick={() => {
                        this.props.clickHandler();
                        this.upload();
                    }}
                >
                    Upload
                </button>
            </div>
        );
    }
}
