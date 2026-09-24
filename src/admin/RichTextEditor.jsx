import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

/**
 * The article body editor.
 *
 * Replaces a plain <textarea> that expected writers to type HTML by hand.
 * That worked while the only authors were us; it does not work for a team
 * publishing weekly, and a single unclosed tag was enough to break an
 * article's layout.
 *
 * Tiptap rather than contentEditable with execCommand: execCommand is
 * deprecated, and the thing it is worst at is exactly what matters here -
 * pasting from Google Docs or Word without dragging in a page of inline
 * styles and empty spans. Tiptap parses a paste against its own schema, so
 * anything it does not recognise is dropped rather than stored.
 *
 * It is loaded only inside the admin panel, which React.lazy keeps out of
 * the public bundle - the editor is larger than the entire rest of the site.
 */
/** Defined outside the editor so it is not a new component type per render. */
const Btn = ({ onClick, active, title, children }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`tt-btn${active ? ' is-active' : ''}`}
  >
    {children}
  </button>
);

const RichTextEditor = ({ value, onChange, onUploadImage }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Anchors written here become real links in the article, so the same
        // rel rules the keyword linker uses apply.
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: 'noopener', target: '_blank' },
        },
      }),
      Image.configure({ HTMLAttributes: { loading: 'lazy' } }),
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class: 'tiptap-body',
        // Tiptap sets contenteditable; spellcheck has to be asked for.
        spellcheck: 'true',
      },
    },
  });

  // Loading an existing post, or applying a template, replaces the document
  // from outside. Guarded against the editor's own updates, which would
  // otherwise reset the cursor to the start on every keystroke.
  useEffect(() => {
    if (!editor) return;
    const incoming = value || '';
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
    // `value` only: reacting to `editor` would re-run on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return <div style={{ padding: 24, color: '#64748b' }}>Loading editor…</div>;

  const promptLink = () => {
    const previous = editor.getAttributes('link').href || '';
    const url = window.prompt('Link to which URL?', previous);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertImage = async (file) => {
    if (!file) return;
    try {
      const src = await onUploadImage(file);
      // Alt text is asked for at insert time rather than left for later,
      // because "later" is how every image on the site ended up without it.
      const alt = window.prompt('Describe this image for screen readers and image search:', '') || '';
      editor.chain().focus().setImage({ src, alt }).run();
    } catch (err) {
      alert(`Image upload failed: ${err.message}`);
    }
  };

  return (
    <div className="tiptap-wrap">
      <div className="tiptap-toolbar">
        <Btn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></Btn>
        <Btn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></Btn>
        <span className="tt-sep" />
        <Btn title="Section heading" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn title="Sub-heading" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Btn>
        <span className="tt-sep" />
        <Btn title="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</Btn>
        <Btn title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</Btn>
        <Btn title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</Btn>
        <span className="tt-sep" />
        <Btn title="Add or edit a link" active={editor.isActive('link')} onClick={promptLink}>Link</Btn>
        <label className="tt-btn" title="Insert an image">
          Image
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => { insertImage(e.target.files?.[0]); e.target.value = ''; }}
          />
        </label>
        <span className="tt-sep" />
        <Btn title="Remove formatting from the selection" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>Clear</Btn>
      </div>

      <EditorContent
        editor={editor}
        onDrop={(e) => {
          const file = e.dataTransfer?.files?.[0];
          if (file?.type?.startsWith('image/')) {
            e.preventDefault();
            insertImage(file);
          }
        }}
      />
    </div>
  );
};

export default RichTextEditor;
