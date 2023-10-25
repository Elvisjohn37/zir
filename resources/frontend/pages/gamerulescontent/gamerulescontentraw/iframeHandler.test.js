import { googleDocs, testData, setErrorGoogleDocs, resetGoogleDocs } from 'frontend/ajax/google';
import { loadGoogleDocsIframe } from './iframeHandler';

jest.mock('frontend/ajax/google');

describe('loadGoogleDocsIframe()', () => {

    let html, head;

    let callback = {
        success: jest.fn(),
        error: jest.fn()
    }

    let iframe = {
        contentWindow: {
            document: {
                getElementsByTagName: (tagName) => {
                    if(tagName == 'html') {
                        (html == undefined) && (html = [ { innerHTML: 'not test data' } ]);
                        return html;
                    } else if(tagName == 'head') {
                        (head == undefined) && (head = [ { innerHTML: 'not test data' } ]);
                        return head;
                    }
                },
                body: {
                    scrollHeight: 100,
                    style: { background: 'not transparent' }
                }
            }
        },
        style: { height: '0px' }
    };

    beforeEach(() => {
        loadGoogleDocsIframe(iframe, "", callback);
    });

    afterEach(() => {
        html && (html = undefined);
        head && (head = undefined);
        jest.clearAllMocks();
        resetGoogleDocs();
    });

    it('should call a function for setting the iframe', () => {
        expect(googleDocs).toHaveBeenCalledWith(
            expect.any(String), 
            expect.any(Function), 
            expect.any(Function)
        );
    });

    it('should set iframe html and head tag name to response.data', () => {
        expect(iframe.contentWindow.document.getElementsByTagName('html')[0].innerHTML).toBe(testData);
        expect(iframe.contentWindow.document.getElementsByTagName('head')[0].innerHTML).toBe(testData);
    });

    it('should set iframe height from height of content inside the iframe', () => {
        let srcollHeight = iframe.contentWindow.document.body.scrollHeight;
        expect(iframe.style.height).toBe(`${srcollHeight}px`);
    });

    it('should set transparent background for iframe content', () => {
        expect(iframe.contentWindow.document.body.style.background).toBe('transparent');
    });

    it('should call success callback function if there i no error occured', () => {
        expect(callback.success).toHaveBeenCalledTimes(1);
    });

    it('should call error callback function if there i no error occured', () => {
        setErrorGoogleDocs();
        loadGoogleDocsIframe(iframe, "", callback);
        expect(callback.error).toHaveBeenCalledTimes(1);
    });
});
