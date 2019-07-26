import React from "react";
import { ProfilePic } from "./profilepic";
import { shallow } from "enzyme";

test("when passed ProfilePic prop, the ProfilePic component renders that image", () => {
    const wrapper = shallow(<ProfilePic imageUrl="./test.gif" />);
    expect(wrapper.find("img").prop("src")).toBe("./test.gif");
});

test("Names as alt", () => {
    const wrapper = shallow(
        <ProfilePic name="Christos" surname="Giannouris" />
    );
    expect(wrapper.find("img").prop("alt")).toBe("Christos Giannouris");
});
