import React from "react";
import { Provider } from 'react-redux';
import { store } from './store';
import { DashboardApp } from './components/DashboardApp';

function App() {
  return (
    <Provider store={store}>
      <DashboardApp />
    </Provider>
  );
}

export default App;