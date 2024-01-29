
export const talkData = {
    scene01: [
        {
            text: "hello",
            speaker: "speaker1",
            sprite: "",
            handler: null,
            selections: [],
        },
        {
            text: "which?",
            sprite: "",
            handler: null,
            selections: [
                { text: "selection-A", nextTalks: [
                    {
                        text: "you selected A",
                        sprite: "",
                        handler: null,
                        selections: [],
                    },
                ] }, 
                { text: "it's selection-B", nextTalks: [
                    {
                        text: "you selected B",
                        sprite: "",
                        handler: null,
                        selections: [],
                    },
                    {
                        text: "B is 2nd selection",
                        sprite: "",
                        handler: null,
                        selections: [],
                    },
                ] }
            ],
        },
        {
            text: "end",
            sprite: "",
            handler: null,
            selections: [],
        },
    ]
}