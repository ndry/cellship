declare module "game-inputs" {
    function createInputs(element?: HTMLElement, options?: {
        preventDefaults: boolean,
        stopPropagation: boolean,
        allowContextMenu: boolean,
        disabled: boolean,
    }): {
        preventDefaults: boolean;
        stopPropagation: boolean;
        allowContextMenu: boolean;
        disabled: boolean;
        tick(): void;
        up: import("eventemitter3");
        down: import("eventemitter3");
        bind(binding: string, ...keys: string[]): void;
        state: { [key: string]: boolean }
    }

    export = createInputs;
}