// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import {enableFetchMocks} from 'jest-fetch-mock';

window.matchMedia = (query: string) => {
    const result: MediaQueryList = {
        matches: true,
        media: '',
        onchange: () => {
        },
        addListener: () => {
        },
        removeListener: () => {
        },
        addEventListener: () => {
        },
        removeEventListener: () => {
        },
        dispatchEvent: (event: Event) => {
            return true;
        }
    };
    return result;
};

// const createElementNSOrig = global.document.createElementNS
// window.document.createElementNS = function(namespaceURI, qualifiedName) {
//   if (namespaceURI==='http://www.w3.org/2000/svg' && qualifiedName==='svg'){
//     var element = createElementNSOrig.apply(this,arguments)
//     element.createSVGRect = function(){};
//     return element;
//   }
//   return createElementNSOrig.apply(this,arguments)
// }

enableFetchMocks();
