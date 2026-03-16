export interface DepartmentNode {
  id: string;
  code: string;
  name: string;
  children?: DepartmentNode[];
}

// 一般的な日本企業をイメージした3階層の部門構造（モック）
export const MOCK_DEPARTMENTS: DepartmentNode[] = [
  {
    id: "dept-root",
    code: "ALL",
    name: "全社",
    children: [
      {
        id: "dept-corp",
        code: "CORP",
        name: "コーポレート本部",
        children: [
          {
            id: "dept-corp-hr",
            code: "HR",
            name: "人事部",
            children: [
              {
                id: "dept-corp-hr-1",
                code: "HR-01",
                name: "人事企画課",
              },
              {
                id: "dept-corp-hr-2",
                code: "HR-02",
                name: "タレントマネジメント課",
              },
            ],
          },
        ],
      },
      {
        id: "dept-prod",
        code: "PRD",
        name: "プロダクト本部",
        children: [
          {
            id: "dept-prod-dev",
            code: "DEV",
            name: "プロダクト開発部",
            children: [
              {
                id: "dept-prod-dev-fe",
                code: "FE",
                name: "フロントエンド開発課",
              },
              {
                id: "dept-prod-dev-be",
                code: "BE",
                name: "バックエンド開発課",
              },
            ],
          },
          {
            id: "dept-prod-cs",
            code: "CS",
            name: "カスタマーサクセス部",
            children: [
              {
                id: "dept-prod-cs-1",
                code: "CS-01",
                name: "オンボーディング課",
              },
            ],
          },
        ],
      },
      {
        id: "dept-sales",
        code: "SLS",
        name: "営業本部",
        children: [
          {
            id: "dept-sales-ent",
            code: "ENT",
            name: "エンタープライズ営業部",
            children: [
              {
                id: "dept-sales-ent-1",
                code: "ENT-01",
                name: "第一営業課",
              },
            ],
          },
        ],
      },
    ],
  },
];

export interface FlatDepartment {
  id: string;
  code: string;
  name: string;
  level: number;
}

function flatten(tree: DepartmentNode[], level = 0, acc: FlatDepartment[] = []): FlatDepartment[] {
  for (const node of tree) {
    acc.push({ id: node.id, code: node.code, name: node.name, level });
    if (node.children?.length) {
      flatten(node.children, level + 1, acc);
    }
  }
  return acc;
}

export const FLAT_DEPARTMENTS: FlatDepartment[] = flatten(MOCK_DEPARTMENTS);

export function getDepartmentById(id: string | null | undefined): FlatDepartment | null {
  if (!id || id === "all") return null;
  return FLAT_DEPARTMENTS.find((d) => d.id === id) ?? null;
}

// UI上で部門を切り替えたときに数値が変わって見えるようにするための簡易スケール
export function getDepartmentScale(id: string | "all"): number {
  switch (id) {
    case "dept-corp":
      return 0.7;
    case "dept-corp-hr":
      return 0.5;
    case "dept-corp-hr-1":
      return 0.4;
    case "dept-corp-hr-2":
      return 0.45;
    case "dept-prod":
      return 0.8;
    case "dept-prod-dev":
      return 0.75;
    case "dept-prod-dev-fe":
      return 0.4;
    case "dept-prod-dev-be":
      return 0.5;
    case "dept-prod-cs":
      return 0.6;
    case "dept-prod-cs-1":
      return 0.5;
    case "dept-sales":
      return 0.3;
    case "dept-sales-ent":
      return 0.35;
    case "dept-sales-ent-1":
      return 0.4;
    case "all":
    default:
      return 1;
  }
}

