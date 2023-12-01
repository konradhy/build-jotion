"use client";

import { useCompletion } from "ai/react";
import { BrainCircuit, Languages, Minimize2 } from "lucide-react";

import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import {
  BlockNoteView,
  useBlockNote,
  getDefaultReactSlashMenuItems,
  ReactSlashMenuItem,
} from "@blocknote/react";
import "@blocknote/core/style.css";

import { useEdgeStore } from "@/lib/edgestore";
import { useEffect, useMemo, useRef } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });

    return response.url;
  };

  //AI Hooks
  const { complete: completeLanguage, completion: completionLanguage } =
    useCompletion({
      api: "/api/generate/language",
    });

  const { complete: completeSynthesize, completion: completionSynthesize } =
    useCompletion({
      api: "/api/generate/synthesize",
    });

  const { complete: completeThought, completion: completionThought } =
    useCompletion({
      api: "/api/generate/completion",
    });

  //AI Blocks
  //translate block
  const translateBlock = async () => {
    let block = editor.getTextCursorPosition().block;
    if (!block || !block.content || block.content.length === 0) {
      return;
    }

    block.content.forEach((contentItem) => {
      if ("text" in contentItem) {
        let aiPrompt = contentItem.text;
        completeLanguage(aiPrompt);
      }
    });
  };

  const insertTranslateBlock: ReactSlashMenuItem = {
    name: "Translate Tailor",
    execute: translateBlock,
    aliases: ["tt", "ai"],
    group: "Ai Tools",
    icon: <Languages size={18} />,
    hint: "Type your message and end with the target language",
  };

  //synthesize block

  const synthesizeBlock = async () => {
    let block = editor.getTextCursorPosition().block;
    if (!block || !block.content || block.content.length === 0) {
      return;
    }

    block.content.forEach((contentItem) => {
      if ("text" in contentItem) {
        let aiPrompt = contentItem.text;
        completeSynthesize(aiPrompt);
      }
    });
  };

  const insertSynthesizeBlock: ReactSlashMenuItem = {
    name: "SummarySynth",
    execute: synthesizeBlock,
    aliases: ["ss", "sy"],
    group: "Ai Tools",
    icon: <Minimize2 size={18} />,
    hint: "Type your text and get a concise, key-point summary.",
  };

  //thought completion block
  const thoughtBlock = async () => {
    let block = editor.getTextCursorPosition().block;
    if (!block || !block.content || block.content.length === 0) {
      return;
    }

    block.content.forEach((contentItem) => {
      if ("text" in contentItem) {
        let aiPrompt = contentItem.text;
        completeThought(aiPrompt);
      }
    });
  };

  const insertThoughtBlock: ReactSlashMenuItem = {
    name: "ElucidatorErik",
    execute: thoughtBlock,
    aliases: ["ss", "sy"],
    group: "Ai Tools",
    icon: <BrainCircuit size={18} />,
    hint: "Begin your thought and let ElucidatorErik delve deeper, effortlessly expanding your sentences with clarity and coherence.",
  };

  const customSlashMenuItemList = [
    ...getDefaultReactSlashMenuItems(),
    insertTranslateBlock,
    insertSynthesizeBlock,
    insertThoughtBlock,
  ];

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUpload,
    slashMenuItems: customSlashMenuItemList,
  });

  //AI Config for translate
  const previousLanguageCompletion = useRef("");
  const tokenLanguage = useMemo(() => {
    if (!completionLanguage) return;
    const diff = completionLanguage.slice(
      previousLanguageCompletion.current.length,
    );
    return diff;
  }, [completionLanguage]);

  useEffect(() => {
    if (!tokenLanguage) return;

    let block = editor.getTextCursorPosition().block;
    if (!block) return;

    editor.updateBlock(block, {
      content: completionLanguage,
    });
  }, [completionLanguage, tokenLanguage, editor]);

  //AI Config for synthesizer
  const previousSynthesizeCompletion = useRef("");
  const tokenSynthesize = useMemo(() => {
    if (!completionSynthesize) return;
    const diff = completionSynthesize.slice(
      previousSynthesizeCompletion.current.length,
    );
    return diff;
  }, [completionSynthesize]);

  useEffect(() => {
    if (!tokenSynthesize) return;

    let block = editor.getTextCursorPosition().block;
    if (!block) return;

    editor.updateBlock(block, {
      content: completionSynthesize,
    });
  }, [completionSynthesize, tokenSynthesize, editor]);

  //Ai config for thoughtCompletion
  const previousThoughtCompletion = useRef("");
  const tokenThought = useMemo(() => {
    if (!completionThought) return;
    const diff = completionThought.slice(
      previousThoughtCompletion.current.length,
    );
    return diff;
  }, [completionThought]);

  useEffect(() => {
    if (!tokenThought) return;

    let block = editor.getTextCursorPosition().block;
    if (!block) return;

    editor.updateBlock(block, {
      content: completionThought,
    });
  }, [completionThought, tokenThought, editor]);

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
