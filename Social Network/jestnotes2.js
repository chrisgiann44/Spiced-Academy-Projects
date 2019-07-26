// app.test.js

import React from 'react';
import App from './app';
import {shallow} from 'enzyme';
import axios from './axios';

// this will create the dumb copy of axios we need
// this dumb copy will have ALL the methods of the real axios, except those methods don't actually do anything (ie they won't actually go out and make a request to a server)
jest.mock('./axios');

test('app sets state in componentDidMount', async () => {
    axios.get.mockResolvedValue({
        data: {
            bio: 'some test bio',
            first_name: 'test first',
            last_name: 'test last',
            profile_pic: 'someTestImg.jpg'
        }
    });

    const wrapper = await shallow(
        <App />, {
            disableLifecycleMethods: true
        }
    );

    await wrapper.instance().componentDidMount();

    expect(
        wrapper.state('first_name')
    ).toBe('test first');

});
