// global
import React from 'react';
import 'regenerator-runtime/runtime';
import { lazy } from 'frontend/tests/__mocks__/reactSpyMock';
import documentMock from 'frontend/tests/__mocks__/documentMock';

// react-testing-library
import '@testing-library/jest-dom';

// jest.spyOn(React, 'lazy').mockImplementation(ImportFn => {return ImportFn});
jest.spyOn(React, 'lazy').mockImplementation(lazy);

// add document object globally
documentMock();
