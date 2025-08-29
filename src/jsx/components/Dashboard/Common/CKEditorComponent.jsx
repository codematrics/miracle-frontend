import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const CKEditorComponent = ({
  value = '',
  onChange,
  placeholder = 'Enter text...',
  height = '200px',
  readOnly = false,
}) => {
  return (
    <div className="ckeditor-container">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        disabled={readOnly}
        config={{
          placeholder: placeholder,
          toolbar: {
            shouldNotGroupWhenFull: true,
          },
        }}
        onChange={(_, editor) => {
          const data = editor.getData();
          if (onChange) onChange(data);
        }}
      />
    </div>
  );
};

export default CKEditorComponent;
