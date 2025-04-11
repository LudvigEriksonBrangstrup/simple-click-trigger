import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UrdfFileModel } from "@/lib/types";

interface UrdfSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  urdfModels: UrdfFileModel[];
  onSelectModel: (model: UrdfFileModel) => void;
}

export function UrdfSelectionModal({
  isOpen,
  onClose,
  urdfModels,
  onSelectModel,
}: UrdfSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select URDF Model</DialogTitle>
          <DialogDescription>
            Multiple URDF files were found. Please select the model you want to
            visualize.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Path</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urdfModels.map((model) => (
                <TableRow key={model.path}>
                  <TableCell className="font-medium">
                    {model.path.split("/").pop()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate max-w-[250px]">
                    {model.path}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => onSelectModel(model)}
                      variant="secondary"
                      size="sm"
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
