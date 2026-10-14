import ReactMarkdown from "react-markdown";

// Raw HTML in content is NOT rendered (react-markdown default), which prevents XSS.
const safeUrl = (url: string) => (/^(https?:|mailto:|\/|#)/i.test(url) ? url : "");

const Markdown = ({ children }: { children: string }) => (
  <div className="prose-blog">
    <ReactMarkdown
      urlTransform={safeUrl}
      components={{
        a: ({ href, children }) => (
          <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer nofollow">
            {children}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  </div>
);

export default Markdown;
