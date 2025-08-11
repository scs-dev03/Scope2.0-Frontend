import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-drop-zone',
  imports: [CommonModule],
  templateUrl: './drop-zone.component.html',
  styleUrl: './drop-zone.component.css'
})
export class DropZoneComponent {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  file: File | null = null;
  previewUrl: string | null = null;
  isDragging = false;

  onClick() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setFile(input.files[0]);
    }
  }
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave() {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.setFile(event.dataTransfer.files[0]);
    }
  }

  setFile(file: File) {
    this.file = file;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.previewUrl = null;
    }
  }

  uploadFile() {
    if (this.file) {
      // TODO: Implement upload logic (API call)
      console.log('Uploading file:', this.file);
    }
  }

  cancelUpload() {
    this.file = null;
    this.previewUrl = null;
    this.fileInput.nativeElement.value = '';
  }
}