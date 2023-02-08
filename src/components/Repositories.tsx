import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { uniq } from 'lodash';
import { useEffect, useState } from 'react';

import type { Repo } from '../api';
import { getTopReposAsync } from '../api';

const Repositories: React.FC = () => {
  const [data, setData] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);

  const languageFilters = uniq(
    data
      .map((repo) => repo.language)
      .filter((value) => value)
      .sort()
  ).map((value) => ({ text: value, value }));

  useEffect(() => {
    const getTopRepos = async (): Promise<void> => {
      setLoading(true);
      setData(await getTopReposAsync());
      setLoading(false);
    };
    const id = setTimeout(() => {
      void getTopRepos();
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  }, []);

  const columns: ColumnsType<Repo> = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      align: 'center',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, { owner, url }) => (
        <div className="flex items-center">
          <a
            className="font-medium"
            href={owner.url}
            target="_black"
            rel="noreferrer"
          >
            <img
              className="w-8 h-8 mr-2 rounded-full"
              src={owner.avatarUrl}
              alt="avatar"
            />
          </a>
          <a href={url} target="_black" rel="noreferrer">
            {name}
          </a>
        </div>
      ),
      width: 250,
    },
    {
      title: 'Stars',
      dataIndex: 'stars',
      key: 'stars',
      render: (stars) => (
        <span className="text-xs font-medium">
          {stars >= 1000 ? `${Math.floor(stars / 1000)}k` : stars}
        </span>
      ),
      width: 100,
    },
    {
      title: 'Forks',
      dataIndex: 'forks',
      key: 'stars',
      sortDirections: ['descend', 'ascend'],
      sorter: (repo1, repo2) => repo1.forks - repo2.forks,
      render: (stars) => (
        <span className="text-xs font-medium">
          {stars >= 1000 ? `${Math.floor(stars / 1000)}k` : stars}
        </span>
      ),
      width: 100,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (description) => (
        <span className="text-sm font-light">{description}</span>
      ),
    },
    {
      title: 'Language',
      key: 'language',
      dataIndex: 'language',
      filters: languageFilters,
      filterSearch: true,
      onFilter: (value, record) => record.language === value,
      render: (language: string) =>
        language ? (
          <Tag color="blue" key={language}>
            {language}
          </Tag>
        ) : (
          <Tag color="orange" key="N/A">
            N/A
          </Tag>
        ),
      width: 150,
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="py-8 text-3xl flex justify-center">Top 100 by Stars</div>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
};

export default Repositories;
