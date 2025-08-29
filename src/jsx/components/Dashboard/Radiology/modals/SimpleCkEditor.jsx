import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const SimpleCkEditor = ({ 
  value = '', 
  onChange, 
  readOnly = false, 
  height = '300px',
  placeholder = 'Enter content here...'
}) => {
  return (
    <div 
      className="border rounded bg-white p-2" 
      style={{ minHeight: height }}
    >
      <CKEditor
        config={{
          toolbar: {
            shouldNotGroupWhenFull: true,
          },
          placeholder: placeholder,
        }}
        editor={ClassicEditor}
        data={value}
        disabled={readOnly}
        onChange={(event, editor) => {
          if (onChange && !readOnly) {
            const data = editor.getData();
            onChange(data);
          }
        }}
      />
    </div>
  );
};

export default SimpleCkEditor;