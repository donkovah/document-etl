export interface QueueInterface {
    enqueueDocument(documentId: string): Promise<void>;
    dequeueDocument(): Promise<string | null>;

    close(): Promise<void>;
}