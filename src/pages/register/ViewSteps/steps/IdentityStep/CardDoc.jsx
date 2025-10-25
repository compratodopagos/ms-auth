import { Preloader } from '@compratodo/ui-components';
import { Upload, FileEdit } from '../../../../../icons';

const CardDoc = ({
    image,
    alt,
    onClick,
    iconCard,
    fileInput,
    onChange,
    styles,
    loading
}) => {

    return (
        <div className={`${styles.cardDoc} rounded-lg relative`}>
            {image ? (
                <>
                    {image && (
                        <div className="absolute p-3 rounded-lg" onClick={onClick} style={{
                            background: 'white',
                            top: 0,
                            right: 0,
                            margin: '10px',
                            cursor: 'pointer'
                        }}>
                            <FileEdit />
                        </div>
                    )}
                    <img src={image} alt={alt} className="w-full rounded" />
                    {loading && (
                        <div className="loading rounded-lg flex items-center justify-center absolute w-full h-full" style={{ background: "#ffffffcf" }}>
                            <Preloader />
                        </div>
                    )}
                </>
            ) : (
                <div className={`${styles.upload}`} onClick={onClick}>
                    {iconCard}
                    <label className="flex items-center mt-1">
                        <Upload className="mr-1 mt-1" />
                        Selecciona o arrastra el archivo aquí.
                    </label>
                </div>
            )}
            <input
                type="file"
                accept="image/jpeg,image/png"
                ref={fileInput}
                className="hidden"
                onChange={onChange}
            />
        </div>
    );

}

export default CardDoc;