import React from "react";
import { connect } from "react-redux";
import { getList } from "./actions";

class Dum extends React.Component {
    componentDidMount() {
        this.props.dispatch(getList());
    }

    render() {
        if (!this.props.animals) {
            return null;
        }
        return (
            <div>
                <h1>redux</h1>
                {this.props.animals.data.length &&
                    this.props.animals.data.map(animal => (
                        <div key={animal}>{animal}</div>
                    ))}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        animals: state.list
    };
};

export default connect(mapStateToProps)(Dum);
