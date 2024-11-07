import type { CatalogItem } from '@lightdash/common';
import { ActionIcon, Badge, Group } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import type { FC } from 'react';
import MantineIcon from '../../../components/common/MantineIcon';

type Props = {
    tag: Pick<CatalogItem['catalogTags'][number], 'name' | 'color'>;
    onTagClick?: () => void;
    onRemove?: () => void;
};

export const CatalogTag: FC<Props> = ({ tag, onTagClick, onRemove }) => {
    return (
        <Badge
            key={tag.name}
            size="sm"
            radius="sm"
            variant="light"
            onClick={onTagClick}
            styles={(theme) => ({
                root: {
                    textTransform: 'none',
                    fontWeight: 400,
                    border: `1px solid ${theme.fn.lighten(tag.color, 0.5)}`,
                    backgroundColor: theme.fn.lighten(tag.color, 0.9),
                    color: theme.fn.darken(tag.color, 0.2),
                    cursor: 'pointer',
                    paddingRight: onRemove ? 2 : 8,
                    '&:hover': {
                        backgroundColor: theme.fn.lighten(tag.color, 0.8),
                    },
                },
            })}
        >
            <Group spacing={1}>
                {tag.name}
                {onRemove && (
                    <ActionIcon
                        variant="transparent"
                        size={12}
                        onClick={onRemove}
                    >
                        <MantineIcon
                            color="gray.8"
                            icon={IconX}
                            strokeWidth={1.8}
                        />
                    </ActionIcon>
                )}
            </Group>
        </Badge>
    );
};