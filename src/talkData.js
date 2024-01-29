export const talkData = {
    scene01: [
        {
            text: "hello",
            speaker: "speaker1",
            sprite: "",
        },
        {
            text: "which?",
            sprite: "",
            handler: null,
            selections: [
                {
                    text: "selection-A",
                    nextTalks: [
                        {
                            text: "you selected A",
                            sprite: "",
                            handler: null,
                            selections: [
                                {
                                    text: "and A - 1",
                                    nextTalks: [
                                        {
                                            text: "A-1 is cool",
                                            sprite: "",
                                        },
                                    ],
                                },
                                {
                                    text: "So A - 2",
                                    nextTalks: [
                                        {
                                            text: "you selected A so A-2",
                                            sprite: "",
                                        },
                                        {
                                            text: "A,A-2 is great",
                                            sprite: "",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    text: "it's selection-B",
                    nextTalks: [
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
                    ],
                },
            ],
        },
        {
            text: "end",
            sprite: "",
            handler: null,
            selections: [],
        },
    ],
};
