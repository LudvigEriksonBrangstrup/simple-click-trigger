import { useUrdf } from "@/hooks/useUrdf";
import { UrdfSelectionModal } from "@/components/ui/UrdfSelectionModal";

/**
 * Container component that manages the URDF selection modal.
 * This is meant to be placed in the application layout to ensure the modal
 * is accessible throughout the application without nesting issues.
 */
export function UrdfSelectionModalContainer() {
  const {
    isSelectionModalOpen,
    setIsSelectionModalOpen,
    urdfModelOptions,
    selectUrdfModel,
  } = useUrdf();

  return (
    <UrdfSelectionModal
      isOpen={isSelectionModalOpen}
      onClose={() => setIsSelectionModalOpen(false)}
      urdfModels={urdfModelOptions}
      onSelectModel={selectUrdfModel}
    />
  );
}
