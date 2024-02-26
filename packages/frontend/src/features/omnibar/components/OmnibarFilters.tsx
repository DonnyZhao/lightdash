import {
    assertUnreachable,
    OrganizationMemberProfile,
    SearchFilters,
    SearchItemType,
} from '@lightdash/common';
import { Button, Flex, Group, Menu, Select } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
    IconAdjustments,
    IconBrowser,
    IconCalendar,
    IconChartBar,
    IconChevronDown,
    IconFolder,
    IconLayoutDashboard,
    IconRectangle,
    IconTable,
    IconUser,
} from '@tabler/icons-react';
import { FC } from 'react';
import MantineIcon from '../../../components/common/MantineIcon';
import { useOrganizationUsers } from '../../../hooks/useOrganizationUsers';
import { allSearchItemTypes } from '../types/searchItem';
import { getDateFilterLabel } from '../utils/getDateFilterLabel';
import { getSearchItemLabel } from '../utils/getSearchItemLabel';
import { getOmnibarItemColor } from './OmnibarItemIcon';

const getOmnibarItemIcon = (itemType: SearchItemType) => {
    switch (itemType) {
        case SearchItemType.FIELD:
            return IconRectangle;
        case SearchItemType.DASHBOARD:
            return IconLayoutDashboard;
        case SearchItemType.CHART:
            return IconChartBar;
        case SearchItemType.SPACE:
            return IconFolder;
        case SearchItemType.TABLE:
            return IconTable;
        case SearchItemType.PAGE:
            return IconBrowser;
        default:
            return assertUnreachable(
                itemType,
                `Unknown search item type: ${itemType}`,
            );
    }
};

type Props = {
    filters?: SearchFilters;
    onSearchFilterChange: (searchFilters?: SearchFilters) => void;
};

function findUserName(
    userUuid: string,
    userList: OrganizationMemberProfile[] = [],
) {
    const user = userList.find((u) => u.userUuid === userUuid);

    if (user) {
        return `${user.firstName} ${user.lastName}`;
    }
}

const OmnibarFilters: FC<Props> = ({ filters, onSearchFilterChange }) => {
    const [isDateMenuOpen, dateMenuHandlers] = useDisclosure(false);
    const [isCreatedByMenuOpen, createdByMenuHelpers] = useDisclosure(false);
    const { data: organizationUsers } = useOrganizationUsers();

    return (
        <Group px="md" py="sm">
            <Menu
                position="bottom-start"
                withArrow
                withinPortal
                shadow="md"
                arrowOffset={11}
                offset={2}
            >
                <Menu.Target>
                    <Button
                        compact
                        variant="default"
                        radius="xl"
                        size="xs"
                        leftIcon={<MantineIcon icon={IconAdjustments} />}
                        rightIcon={<MantineIcon icon={IconChevronDown} />}
                    >
                        {filters?.type
                            ? getSearchItemLabel(filters.type as SearchItemType)
                            : 'All items'}
                    </Button>
                </Menu.Target>

                <Menu.Dropdown>
                    {allSearchItemTypes.map((type) => (
                        <Menu.Item
                            key={type}
                            icon={
                                <MantineIcon
                                    icon={getOmnibarItemIcon(type)}
                                    color={getOmnibarItemColor(type)}
                                />
                            }
                            bg={type === filters?.type ? 'blue.1' : undefined}
                            onClick={() => {
                                onSearchFilterChange({
                                    ...filters,
                                    type:
                                        type === filters?.type
                                            ? undefined
                                            : type,
                                });
                            }}
                        >
                            {getSearchItemLabel(type)}
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>
            <Menu
                position="bottom-end"
                withArrow
                withinPortal
                shadow="md"
                arrowOffset={11}
                offset={2}
                opened={isDateMenuOpen}
                onOpen={dateMenuHandlers.open}
                onClose={dateMenuHandlers.close}
            >
                <Menu.Target>
                    <Button
                        compact
                        variant="default"
                        radius="xl"
                        size="xs"
                        leftIcon={<MantineIcon icon={IconCalendar} />}
                        rightIcon={<MantineIcon icon={IconChevronDown} />}
                    >
                        {getDateFilterLabel(filters)}
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>
                    <Flex direction="column" align="flex-end">
                        <DatePicker
                            type="range"
                            allowSingleDateInRange
                            maxDate={new Date()}
                            value={[
                                filters?.fromDate
                                    ? new Date(filters.fromDate)
                                    : null,
                                filters?.toDate
                                    ? new Date(filters.toDate)
                                    : null,
                            ]}
                            onChange={(value) => {
                                const [fromDate, toDate] = value;

                                onSearchFilterChange({
                                    ...filters,
                                    fromDate: fromDate?.toISOString(),
                                    toDate: toDate?.toISOString(),
                                });

                                if (fromDate && toDate) {
                                    dateMenuHandlers.close();
                                }
                            }}
                        />
                        <Button
                            compact
                            variant="white"
                            size="xs"
                            mt="sm"
                            style={{ alignSelf: 'flex-end' }}
                            onClick={() => {
                                onSearchFilterChange({
                                    ...filters,
                                    fromDate: undefined,
                                    toDate: undefined,
                                });
                            }}
                        >
                            Clear
                        </Button>
                    </Flex>
                </Menu.Dropdown>
            </Menu>
            <Menu
                position="bottom-end"
                withArrow
                withinPortal
                shadow="md"
                arrowOffset={11}
                offset={2}
                opened={isCreatedByMenuOpen}
                onOpen={createdByMenuHelpers.open}
                onClose={createdByMenuHelpers.close}
            >
                <Menu.Target>
                    <Button
                        compact
                        variant="default"
                        radius="xl"
                        size="xs"
                        leftIcon={<MantineIcon icon={IconUser} />}
                        rightIcon={<MantineIcon icon={IconChevronDown} />}
                    >
                        {filters?.createdByUuid
                            ? findUserName(
                                  filters.createdByUuid,
                                  organizationUsers,
                              )
                            : 'Created by'}
                    </Button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Select
                        placeholder="Select a user"
                        searchable
                        value={filters?.createdByUuid}
                        allowDeselect
                        limit={5}
                        data={
                            organizationUsers?.map((user) => ({
                                value: user.userUuid,
                                label: `${user.firstName} ${user.lastName}`,
                            })) || []
                        }
                        onChange={(value) => {
                            onSearchFilterChange({
                                ...filters,
                                createdByUuid: value || undefined,
                            });

                            createdByMenuHelpers.close();
                        }}
                    />
                </Menu.Dropdown>
            </Menu>
        </Group>
    );
};

export default OmnibarFilters;
