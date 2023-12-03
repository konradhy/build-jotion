"use client";

/*
1. Ai tools only work by reading the current block and then updating it. This can be improved by taking advantage of insert, replace, nest/unnest, identifying certain blocks, etc to make more dynamic and useful tools.
2. This editor is 300 lines long. The AI blocks can easily be moved to their own files and folder structure
3. Live Editor update doesn't exist. The bug lies with when and how I rerender the content Doesn't quite work right. Whether typing is controlled by the update document function in the parent component or the window.document.listener I still get the same result.
        The editor rerendering in an infinite loop. I think it is because the editor is rerendering when the blocks are replaced and then the blocks are replaced again because the editor is rerendering.
4. The token/completion section needs to be reworked
*/

import { useCompletion } from "ai/react";
import { BrainCircuit, Languages, Minimize2, Wand } from "lucide-react";

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
import { useEffect, useMemo, useRef, useState } from "react";
import { PresenceData } from "@/hooks/usePresence";

type Data = {
  text: string;
  x: number;
  y: number;
  typing: boolean;
  name: string;
};
interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
  liveContent?: string;
  myPresenceData?: Data;
  othersPresence?: PresenceData<Data>[];
}

const Editor = ({
  onChange,
  initialContent,
  editable,
  liveContent,
  myPresenceData,
  othersPresence,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const [notification, setNotification] = useState(false);

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

  const { complete: completeActionPlan, completion: completionActionPlan } =
    useCompletion({
      api: "/api/generate/actionplan",
    });

  const { complete: completeStory, completion: completionStory } =
    useCompletion({
      api: "/api/generate/storymaker",
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

  //actionplan block

  const actionPlanBlock = async () => {
    let block = editor.getTextCursorPosition().block;
    if (!block || !block.content || block.content.length === 0) {
      return;
    }

    block.content.forEach((contentItem) => {
      if ("text" in contentItem) {
        let aiPrompt = contentItem.text;
        completeActionPlan(aiPrompt);
      }
    });
  };

  const insertActionPlanBlock: ReactSlashMenuItem = {
    name: "Action Angel",
    execute: actionPlanBlock,
    aliases: ["aa", "an"],
    group: "Ai Tools",
    icon: <Wand size={18} />,
    hint: "Type your text and get a concise, key-point summary.",
  };

  //StoryMaker  block
  const storyBlock = async () => {
    let block = editor.getTextCursorPosition().block;
    if (!block || !block.content || block.content.length === 0) {
      return;
    }

    block.content.forEach((contentItem) => {
      if ("text" in contentItem) {
        let aiPrompt = contentItem.text;
        completeStory(aiPrompt);
      }
    });
  };

  const insertThoughtBlock: ReactSlashMenuItem = {
    name: "Tale Spinner",
    execute: storyBlock,
    aliases: ["ts", "sp"],
    group: "Ai Tools",
    icon: <BrainCircuit size={18} />,
    hint: "Type some words and Tale Spinner will generate a story for you!",
  };

  const customSlashMenuItemList = [
    ...getDefaultReactSlashMenuItems(),
    insertTranslateBlock,
    insertActionPlanBlock,
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

  //AI Config for ActionPlan

  const previousActionPlanCompletion = useRef("");
  const tokenActionPlan = useMemo(() => {
    if (!completionActionPlan) return;
    const diff = completionActionPlan.slice(
      previousActionPlanCompletion.current.length,
    );
    return diff;
  }, [completionActionPlan]);

  useEffect(() => {
    if (!tokenActionPlan) return;

    let block = editor.getTextCursorPosition().block;
    if (!block) return;

    editor.updateBlock(block, {
      content: completionActionPlan,
    });
  }, [completionActionPlan, tokenActionPlan, editor]);

  //Ai config for story maker
  const previousStoryCompletion = useRef("");
  const tokenStory = useMemo(() => {
    if (!completionStory) return;
    const diff = completionStory.slice(previousStoryCompletion.current.length);
    return diff;
  }, [completionStory]);

  useEffect(() => {
    if (!tokenStory) return;

    let block = editor.getTextCursorPosition().block;
    if (!block) return;

    editor.updateBlock(block, {
      content: completionStory,
    });
  }, [completionStory, tokenStory, editor]);

  //Live content

  //when live content changes, update the editor
  const removeAllBlocks = () => {
    const allBlocks = editor.topLevelBlocks;
    const blockIdentifiers = allBlocks.map((block) => block.id);
    editor.removeBlocks(blockIdentifiers);
  };

  const replaceAllBlocks = () => {
    if (!liveContent) return;
    console.log("live automatically");
    const blocksToInsert = JSON.parse(liveContent) as PartialBlock[];

    console.log("blocks to insert", blocksToInsert);
    console.log("editor blocks", editor.topLevelBlocks);

    // console.log("blocks to insert", blocksToInsert);
    removeAllBlocks();

    editor.insertBlocks(blocksToInsert, editor.topLevelBlocks[0]);
    setNotification(false);
  };

  useEffect(() => {
    // Check if any user in othersPresence is currently typing
    const isAnyoneTyping = othersPresence?.some(
      (presence) => presence.data.typing,
    );
    //if someone is typing and live content exists then compare the blocks
    if (isAnyoneTyping && liveContent) {
      console.log("someone is typing");
      const blocksToCompare = JSON.parse(liveContent) as PartialBlock[];
      const editorBlocks = editor.topLevelBlocks;
      if (blocksToCompare === editorBlocks) {
        console.log("blocks are the same");
        return;

        //if there is a difference, then we know that live content has changed and we can call replaceAllBlocks
      } else {
        setNotification(true);
        console.log("blocks are different");
      }
    }
  }, [othersPresence]);

  return (
    <div>
      <div className="flex flex-col">
        {notification && (
          <button
            onClick={replaceAllBlocks}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm p-3 rounded-md flex items-center justify-center transition duration-300 ease-in-out"
          >
            <p className="font-medium">
              Click to synchronize with the latest changes made by
              collaborators.
            </p>
          </button>
        )}
      </div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
