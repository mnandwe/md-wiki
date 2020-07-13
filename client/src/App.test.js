import React from 'react';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

import renderWithRouter from './helper/testinghelper';
import { ArticleList } from './articleList/ArticleList';


test('Render main page',  () => {
  const route = '/'
  const {container} = renderWithRouter(<App />, { route })
  const appContainer = container
  expect(appContainer.innerHTML).toMatch('Wiki Articles')
})

test('Can see a list of articles', async () => {
  const route = '/';
  let fakeResp = { status: 200, data: { Content: [{name:"Test"}, {name:"Test"}] } };
  jest.spyOn(axios, "get").mockImplementation(() => {
      const then = Promise.resolve(fakeResp)
      return then;
  }
  );
  const { container, history } = await renderWithRouterMatch(ArticleList, { route, path: '/' });
  expect(container.querySelector('.container>ul.result-list>li>a')).toHaveTextContent('test');
});