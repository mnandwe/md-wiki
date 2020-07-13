import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import { renderWithRouterMatch } from '../helper/testinghelper';
import { Article } from './Article';
import axios from 'axios';


test('Can view an article', async () => {
    const fakeResp = { status: 200, data: {Content: "Fake Content" }};
    jest.spyOn(axios, "get").mockImplementation(() => {
        const then = Promise.resolve(fakeResp)
        return then;
    }
    );
    const route = '/fake';
    const { container } = await renderWithRouterMatch(Article, { route, path: '/:name' });
    expect(container.querySelector('#article-container>.article-head>h2')).toHaveTextContent('fake');

});
test('Article not found message if it doesn\'t exist', async  () => {
    const route = '/test_wrong_article';
    const fakeResp = { status: 404, data: {Content: ""} };
    jest.spyOn(axios, "get").mockImplementation(() => {
        const then = Promise.resolve(fakeResp)
        return then;
    }
    );
    const { container, history } = await renderWithRouterMatch(Article, { route, path: '/:name' });
    expect(history.location.pathname).toEqual(`/test_wrong_article`);
    expect(container.querySelector('#article-container>.article-head>h2')).toHaveTextContent('Article Not found');
});
