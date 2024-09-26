import {v4 as uuid} from "uuid";
import type {FileDescriptor} from "./lib";

function getRandomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/* TEST DATA */
export const defaultFileTree: FileDescriptor = {
    id: "92b833f9-b266-472c-a9d9-70d3ce719e92",
    name: "root",
    selected: false,
    metadata: {
        "size": {
            name: "Size",
            value: 123123,
        },
        "created_at": {
            name: "Created At",
            value: getRandomDate(new Date(2020, 0, 1), new Date()),
        }
    },
    href: "/",
    mimeType: "folder",
    path: "/",
    children: [
        {
            id: "0a41d5c8-321d-4cf0-8a7b-dac2d46df977",
            name: "documents",
            selected: false,
            metadata: {
                "size": {
                    name: "Size",
                    value: 43525,
                },
                "created_at": {
                    name: "Created At",
                    value: getRandomDate(new Date(2020, 0, 1), new Date()),
                }
            },
            mimeType: "folder",
            href: "/documents",
            path: "/documents",
            children: [
                {
                    id: "36c06964-b82e-4d79-909d-ac9fd0dfcdc3",
                    name: "work",
                    selected: false,
                    metadata: {
                        "size": {
                            name: "Size",
                            value: 6456456,
                        },
                        "created_at": {
                            name: "Created At",
                            value: getRandomDate(new Date(2020, 0, 1), new Date()),
                        }
                    },
                    mimeType: "folder",
                    href: "/documents/work",
                    path: "/documents/work",
                    children: [
                        {
                            id: "64b87cad-b86f-4163-a47e-c56d7f8a88e4",
                            name: "report.docx",
                            selected: false,
                            metadata: {
                                "size": {
                                    name: "Size",
                                    value: 234234,
                                },
                                "created_at": {
                                    name: "Created At",
                                    value: getRandomDate(new Date(2020, 0, 1), new Date()),
                                }
                            },
                            href: "https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_100KB_DOCX.docx",
                            mimeType:
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            path: "/documents/work/report.docx",
                        },
                        {
                            id: uuid(),
                            name: "presentation.pptx",
                            selected: false,
                            metadata: {
                                "size": {
                                    name: "Size",
                                    value: 7457435,
                                },
                                "created_at": {
                                    name: "Created At",
                                    value: getRandomDate(new Date(2020, 0, 1), new Date()),
                                }
                            },
                            mimeType: "application/pdf",
                            path: "/documents/work/report.docx",
                            href: "https://pdfobject.com/pdf/sample.pdf",
                        },
                        {
                            id: uuid(),
                            name: "data",
                            selected: false,
                            metadata: {
                                "size": {
                                    name: "Size",
                                    value: 1235543,
                                },
                                "created_at": {
                                    name: "Created At",
                                    value: getRandomDate(new Date(2020, 0, 1), new Date()),
                                }
                            },
                            href: "/documents/work/data",
                            path: "/documents/work/data",
                            mimeType: "folder",
                            children: [
                                {
                                    id: uuid(),
                                    name: "sheet1.xlsx",
                                    selected: false,
                                    metadata: {
                                        "size": {
                                            name: "Size",
                                            value: 34513123,
                                        },
                                        "created_at": {
                                            name: "Created At",
                                            value: getRandomDate(new Date(2020, 0, 1), new Date()),
                                        }
                                    },
                                    mimeType: "application/pdf",
                                    path: "/documents/work/data/sheet1.xlsx",
                                    href: "https://pdfobject.com/pdf/sample.pdf",
                                },
                                {
                                    id: uuid(),
                                    name: "sheet2.xlsx",
                                    selected: false,
                                    metadata: {
                                        "size": {
                                            name: "Size",
                                            value: 6768678,
                                        },
                                        "created_at": {
                                            name: "Created At",
                                            value: getRandomDate(new Date(2020, 0, 1), new Date()),
                                        }
                                    },
                                    mimeType: "application/pdf",
                                    path: "/documents/work/data/sheet2.xlsx",
                                    href: "https://pdfobject.com/pdf/sample.pdf",
                                },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "personal",
                    selected: false,
                    metadata: {
                        "size": {
                            name: "Size",
                            value: 653345,
                        },
                        "created_at": {
                            name: "Created At",
                            value: getRandomDate(new Date(2020, 0, 1), new Date()),
                        }
                    },
                    href: "/documents/personal",
                    path: "/documents/personal",
                    mimeType: "folder",
                    children: [
                        {
                            id: uuid(),
                            name: "resume.pdf",
                            selected: false,
                            metadata: {
                                "size": {
                                    name: "Size",
                                    value: 5345123,
                                },
                                "created_at": {
                                    name: "Created At",
                                    value: getRandomDate(new Date(2020, 0, 1), new Date()),
                                }
                            },
                            mimeType: "application/pdf",
                            path: "/documents/personal/resume.pdf",
                            href: "https://pdfobject.com/pdf/sample.pdf",
                        },
                        {
                            id: uuid(),
                            name: "budget.xlsx",
                            selected: false,
                            metadata: {
                                "size": {
                                    name: "Size",
                                    value: 875422,
                                },
                                "created_at": {
                                    name: "Created At",
                                    value: getRandomDate(new Date(2020, 0, 1), new Date()),
                                }
                            },
                            mimeType: "application/pdf",
                            path: "/documents/personal/budget.xlsx",
                            href: "https://pdfobject.com/pdf/sample.pdf",
                        },
                    ],
                },
            ],
        },
        {
            id: uuid(),
            name: "photos",
            selected: false,
            metadata: {
                "size": {
                    name: "Size",
                    value: 42346788,
                },
                "created_at": {
                    name: "Created At",
                    value: getRandomDate(new Date(2020, 0, 1), new Date()),
                }
            },
            mimeType: "folder",
            href: "/photos",
            path: "/photos",
            children: [
                {
                    id: uuid(),
                    name: "vacation2023",
                    selected: false,
                    metadata: {
                        "size": {
                            name: "Size",
                            value: 23423,
                        },
                        "created_at": {
                            name: "Created At",
                            value: getRandomDate(new Date(2020, 0, 1), new Date()),
                        }
                    },
                    mimeType: "folder",
                    href: "/photos/vacation2023",
                    path: "/photos/vacation2023",
                    children: Array(30)
                        .fill(null)
                        .map((_, i) => ({
                            id: uuid(),
                            name: `photo${i + 1}.jpg`,
                            selected: false,
                            metadata: {
                                "size": {
                                    name: "Size",
                                    value: 3453457,
                                },
                                "created_at": {
                                    name: "Created At",
                                    value: getRandomDate(new Date(2020, 0, 1), new Date()),
                                }
                            },
                            mimeType: "image/jpeg",
                            path: `/photos/vacation2023/photo${i + 1}.jpg`,
                            href: `/photos/vacation2023/photo${i + 1}.jpg`,
                        })),
                },
                {
                    id: uuid(),
                    name: "family",
                    selected: false,
                    metadata: {
                        "size": {
                            name: "Size",
                            value: 33235,
                        },
                        "created_at": {
                            name: "Created At",
                            value: getRandomDate(new Date(2020, 0, 1), new Date()),
                        }
                    },
                    href: "/photos/family",
                    path: "/photos/family",
                    mimeType: "folder",
                    children: [
                        {
                            id: uuid(),
                            name: "birthday.jpg",
                            selected: false,
                            metadata: {
                                "size": {
                                    name: "Size",
                                    value: 22222,
                                },
                                "created_at": {
                                    name: "Created At",
                                    value: getRandomDate(new Date(2020, 0, 1), new Date()),
                                }
                            },
                            mimeType: "image/jpeg",
                            path: "/photos/family/birthday.jpg",
                            href: "https://gssc.esa.int/navipedia/images/a/a9/Example.jpg",
                        },
                        {
                            id: uuid(),
                            name: "wedding.jpg",
                            selected: false,
                            metadata: {
                                "size": {
                                    name: "Size",
                                    value: 43245,
                                },
                                "created_at": {
                                    name: "Created At",
                                    value: getRandomDate(new Date(2020, 0, 1), new Date()),
                                }
                            },
                            mimeType: "image/jpeg",
                            path: "/photos/family/birthday.jpg",
                            href: "https://gssc.esa.int/navipedia/images/a/a9/Example.jpg",
                        },
                        {
                            id: uuid(),
                            name: "pets",
                            selected: false,
                            metadata: {
                                "size": {
                                    name: "Size",
                                    value: 65467,
                                },
                                "created_at": {
                                    name: "Created At",
                                    value: getRandomDate(new Date(2020, 0, 1), new Date()),
                                }
                            },
                            href: "/photos/family/pets",
                            path: "/photos/family/pets",
                            mimeType: "folder",
                            children: Array(10)
                                .fill(null)
                                .map((_, i) => ({
                                    id: uuid(),
                                    name: `pet${i + 1}.jpg`,
                                    selected: false,
                                    metadata: {
                                        "size": {
                                            name: "Size",
                                            value: 856755,
                                        },
                                        "created_at": {
                                            name: "Created At",
                                            value: getRandomDate(new Date(2020, 0, 1), new Date()),
                                        }
                                    },
                                    mimeType: "image/jpeg",
                                    path: `/photos/family/pets/pet${i + 1}.jpg`,
                                    href: `/photos/family/pets/pet${i + 1}.jpg`,
                                })),
                        },
                    ],
                },
            ],
        },
        {
            id: uuid(),
            name: "software",
            selected: false,
            metadata: {
                "size": {
                    name: "Size",
                    value: 123567,
                },
                "created_at": {
                    name: "Created At",
                    value: getRandomDate(new Date(2020, 0, 1), new Date()),
                }
            },
            href: "/software",
            path: "/software",
            mimeType: "folder",
            children: [
                {
                    id: uuid(),
                    name: "app1.exe",
                    selected: false,
                    metadata: {
                        "size": {
                            name: "Size",
                            value: 978762,
                        },
                        "created_at": {
                            name: "Created At",
                            value: getRandomDate(new Date(2020, 0, 1), new Date()),
                        }
                    },
                    mimeType: "image/jpeg",
                    path: "/software/app1.exe",
                    href: "https://gssc.esa.int/navipedia/images/a/a9/Example.jpg",
                },
                {
                    id: uuid(),
                    name: "app2.dmg",
                    selected: false,
                    metadata: {
                        "size": {
                            name: "Size",
                            value: 345345,
                        },
                        "created_at": {
                            name: "Created At",
                            value: getRandomDate(new Date(2020, 0, 1), new Date()),
                        }
                    },
                    mimeType: "image/jpeg",
                    path: "/software/app2.dmg",
                    href: "https://gssc.esa.int/navipedia/images/a/a9/Example.jpg",
                },
            ],
        },
        ...Array(50)
            .fill(null)
            .map((_, i) => ({
                id: uuid(),
                name: `file${i + 1}.txt`,
                selected: false,
                metadata: {
                    "size": {
                        name: "Size",
                        value: 123567,
                    },
                    "created_at": {
                        name: "Created At",
                        value: getRandomDate(new Date(2020, 0, 1), new Date()),
                    }
                },
                mimeType: "image/jpeg",
                path: `/file${i + 1}.txt`,
                href: `/file${i + 1}.txt`,
            })),
    ],
};
/* TEST DATA */
