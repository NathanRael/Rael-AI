import {createRoot} from 'react-dom/client'
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'

const MarkdownTest = () => {
    
// Did you know you can use tildes instead of backticks for code in markdown? ✨
    const markdown = `Here is some JavaScript code:

~~~js
console.log('It works!')
~~~
`

    createRoot(document.body).render(
        <Markdown
            children={markdown}
            components={{
                code(props) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const {children, className, node, ...rest} = props
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                        <SyntaxHighlighter
                            {...rest}
                            PreTag="div"
                            children={String(children).replace(/\n$/, '')}
                            language={match[1]}
                            style={dark}
                        />
                    ) : (
                        <code {...rest} className={className}>
                            {children}
                        </code>
                    )
                }
            }}
        />
    )
};

export default MarkdownTest;