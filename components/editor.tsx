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
import { remove } from "@/convex/documents";

//fix type safety props
interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
  liveContent?: string;
  myPresenceData: any;
  othersPresence:any
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
  const liveContentRef = useRef(liveContent);


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
  };


  useEffect(() => {
    // Check if any user in othersPresence is currently typing
    const isAnyoneTyping = othersPresence.some(presence => presence.data.typing);

   
    //if someone is typing and live content exists then compare the blocks 
    if (isAnyoneTyping && liveContent) {
  
      console.log("someone is typing")

      const blocksToCompare = JSON.parse(liveContent) as PartialBlock[];
      const editorBlocks = editor.topLevelBlocks;
      
 
      if(blocksToCompare===editorBlocks){
               console.log("blocks are the same")
        return
 
        //if there is a difference, then we know that live content has changed and we can call replaceAllBlocks
      }else{
       //replaceAllBlocks()
        /*
        
        Doesn't quite work right. Whether typing is controlled by the update document function in the parent component or the window.document.listener I still get the same result.
        The editor rerendering in an infinite loop. I think it is because the editor is rerendering when the blocks are replaced and then the blocks are replaced again because the editor is rerendering.

        */

        console.log("blocks are different")
       
   
      
      }

      // replaceAllBlocks();


      /*
      step 1: get live content which comes from a prop It is already a string
      step 2: get the blocks from the editor, 
      step 3: convert both blocks to strings
      step 4: compare the strings
      step 5: if they are the same, do nothing
    

      */
    }

    



 
  }, [othersPresence ]);



  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />

      <div className="flex flex-col">
        <button onClick={replaceAllBlocks}>Update Collaborators</button>
      </div>
    </div>
  );
};

export default Editor;
