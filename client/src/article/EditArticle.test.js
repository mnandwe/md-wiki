import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import { renderWithRouterMatch } from '../helper/testinghelper';
import axios from 'axios';
import { EditArticle } from './EditArticle';

test('Can create an article', async () => {
    const route = '/edit/test_wrong_article';
    jest.spyOn(axios, "get")
        .mockImplementation(() =>Promise.reject("Not found"));
    const { container, history } = await renderWithRouterMatch(EditArticle, { route, path: '/edit/:name' });
    expect(container.querySelector('.container>.article-editable>h3')).toHaveTextContent('Edit Content');
});

test('Can edit an article with preview', async () => {
    const route = '/edit/test_wrong_article';
    let fakeResp = { status: 200, data: { Content: "## Test" } };
    jest.spyOn(axios, "get").mockImplementation(() => {
        const then = Promise.resolve(fakeResp)
        return then;
    }
    );
    const { container, history } = await renderWithRouterMatch(EditArticle, { route, path: '/edit/:name' });
    expect(container.querySelector('.container>.article-content>.preview>h2')).toHaveTextContent('Test');
});