// Export all codespace components for easy importing
export { Codespace } from './Codespace';
export { MonacoEditor } from './MonacoEditor';
export { LanguageSelector } from './LanguageSelector';
export { OutputPanel } from './OutputPanel';
export { InputPanel } from './InputPanel';
export { Toolbar } from './Toolbar';

// Export types and configs
export type { Language } from '../../config/languages';
export { SUPPORTED_LANGUAGES, getLanguageById, getDefaultLanguage } from '../../config/languages';
export type { ExecutionResult, ExecutionRequest } from '../../services/codeExecutionService';
export { codeExecutionService } from '../../services/codeExecutionService';