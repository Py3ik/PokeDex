import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCollection } from "@/hooks/mutations/Collection/useCreateCollection";
import { useToast } from "@/context/useToast";
import { parseCollectionFile } from "@/utils/collection";
import Modal from "@/components/Modal";

const UploadCollection = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importSuccessModalRef = useRef<HTMLDialogElement>(null);
  const showToast = useToast();
  const navigate = useNavigate();
  const { mutateAsync, isPending: isImporting } = useCreateCollection();
  const [importedId, setImportedId] = useState<string | null>(null);

  return (
    <>
      <div
        className={`border-2 border-dashed rounded-2xl p-6 mb-6 text-center transition-colors ${
          isImporting
            ? "border-primary bg-base-100 cursor-not-allowed"
            : "border-base-300 cursor-pointer hover:border-primary hover:bg-base-100"
        }`}
        onClick={() => !isImporting && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              const json = await parseCollectionFile(file);
              const created = await mutateAsync(json);
              setImportedId(created._id);
              importSuccessModalRef.current?.showModal();
            } catch {
              showToast("Invalid file", "error");
            }
            e.target.value = "";
          }}
        />
        {isImporting ? (
          <>
            <span className="loading loading-spinner loading-md text-primary mb-2" />
            <p className="font-medium">Importing...</p>
          </>
        ) : (
          <>
            <div className="text-3xl mb-2">📂</div>
            <p className="font-medium">Upload saved list</p>
            <p className="text-sm text-base-content/50">
              Click or drag a .json file to restore a list
            </p>
          </>
        )}
      </div>

      <Modal
        ref={importSuccessModalRef}
        title="Collection imported!"
        actions={
          <div className="flex gap-2 justify-end w-full">
            <form method="dialog">
              <button className="btn">Stay here</button>
            </form>
            <button
              className="btn btn-primary"
              onClick={() =>
                importedId && navigate(`/collection/${importedId}`)
              }
            >
              Go to collection
            </button>
          </div>
        }
      >
        <p>Your collection was successfully restored from the file.</p>
      </Modal>
    </>
  );
};

export default UploadCollection;
