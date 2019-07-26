// profilepic.test.js

import React from 'react';
import ProfilePic from './profilepic';
import { shallow } from 'enzyme';

test('when passed profilePic prop, the ProfilePic component renders that image', () => {
    const wrapper = shallow(<ProfilePic profilePic = '/test.jpg'/> );

    expect(
        wrapper.find('img').prop('src')
    ).toBe('/test.jpg');

});

test('When no url is passed our default image is in src', () => {
    const wrapper = shallow(<ProfilePic />);

    expect(
        wrapper.find('img').prop('src')
    ).toBe('./cat.jpg');

});

test('first and last name appear in alt', () => {
    const wrapper = shallow(
        <ProfilePic first='ivana' last='matijevic'/>
    );

    expect(
        wrapper.find('img').prop('alt')
    ).toBe('ivana matijevic');

});

test('passing prop onClick will be invoked when user clicks on image', () => {
    // create a dumb copy of onClick that does nothing.
    // the reason I create a dumb copy, or mock, of the onClick event handler is so that I can check that it is invoked when I expect it to be invoked.
    const onClick = jest.fn();
    const wrapper = shallow(
        <ProfilePic onClick = { onClick } />
    );
    wrapper.simulate('click');
    wrapper.simulate('click');
    wrapper.simulate('click');
    wrapper.simulate('click');
    wrapper.simulate('click');
    // onClick.mock.calls.length tells you how many times onClick was called.
    expect(
        onClick.mock.calls.length
    ).toBe(5);

});
