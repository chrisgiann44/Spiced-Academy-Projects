import React from "react";
import { App } from "./app";
import { shallow } from "enzyme";
import axios from "./axios";

jest.mock("./axios");

test("app set State in componentDidMount", async () => {
    axios.get.mockResolvedValue({
        data: {
            id: 3,
            name: "Christos"
        }
    });

    const wrapper = shallow(<App />, {
        disableLifecycleMethods: true
    });

    await wrapper.instance().componentDidMount();

    expect(wrapper.state("name")).toBe("Christos");
});
