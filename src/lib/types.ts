/**
 * Shared type definitions for URDF parsing from supabase edge function
 */

export interface UrdfData {
  name?: string;
  description?: string;
  mass?: number;
  dofs?: number;
  joints?: {
    revolute?: number;
    prismatic?: number;
    continuous?: number;
    fixed?: number;
    other?: number;
  };
  links?: {
    name?: string;
    mass?: number;
  }[];
  materials?: {
    name?: string;
    percentage?: number;
  }[];
}

/**
 * Interface representing a URDF file model
 */
export interface UrdfFileModel {
  /**
   * Path to the URDF file
   */
  path: string;

  /**
   * Blob URL for accessing the file
   */
  blobUrl: string;

  /**
   * Name of the model extracted from the file path
   */
  name?: string;
}
